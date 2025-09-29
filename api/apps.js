const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectGateway, updateDB, readArgsFromDB, pg_connexion, getTransactions, getTransactionEntries } = require('./connexion');
const { enrollUser, ensureAuth } = require('./add_Identity')
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { initFabricListener, closeFabricListener } = require('./blockListner')
// Initialisation d'Express
const app = express();
const session = require('express-session');
require('dotenv').config;

app.use(session({
  secret: process.env.SECRET,   // Ã  personnaliser
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }             // true si HTTPS
}));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // GÃ¨re les formulaires HTML

//Lancement de l'ecoute
initFabricListener();

function ensureDbAuth(req, res, next) {
  if (req.session.dbUser) {
    return next();
  }
  // Non authentifiÃ© â†’ redirect vers login
  return res.redirect('login.html');
}

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../web-app', 'login.html'));
});
// ---------------------------------------------------------------
// Routes Directement IntÃ©grÃ©es
// ---------------------------------------------------------------

/**
 * @route POST /api/products
 * @description CrÃ©e un nouveau produit dans la blockchain
 * @body {String} productID - ID unique du produit
 * @body {String} name - Nom du produit
 * @body {Number} price - Prix du produit
 * @body {Number} quantity - QuantitÃ© en stock
 * @body {String} user - IdentitÃ© blockchain de l'utilisateur
 */

app.post('/api/blockchain/post', ensureAuth, async (req, res) => {
  let gateway, state;
  const currentUser = req.session.userId;

  try {
    const args = await readArgsFromDB(req.body.id);
    console.log('ARGS:', args);
    const { id, type, debitAccount, creditAccount, amount, macAddress } = args;

    console.log(currentUser);
    // 1. Connexion et rÃ©cupÃ©ration du contract
    gateway = await connectGateway(currentUser);
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('operation_comptable');

    // 2. PrÃ©parer la transaction
    const transaction = contract.createTransaction('CreateTransaction');
    const txId = transaction.getTransactionId();
    console.log(`Transaction ID = ${txId}`);

    // 3. Installer le commit listener sur tous les peers endorsants
    const endorsingPeers = network.getChannel().getEndorsers();
    //console.log(endorsingPeers);
    await network.addCommitListener(
      (err, commitEvent) => {
        if (err) {
          console.error(`Commit error on peer ${commitEvent.peer.name}:`, err);
          state = 'REJECTED';
        } else {
          console.log(
            `Transaction ${commitEvent.transactionId} committed on peer ${commitEvent.peer.name} with status ${commitEvent.status}`
          );
        }
      },
      endorsingPeers,
      txId
    );

    // 4. Submit() â†’ envoi Ã  lâ€™orderer et attente de son ACK
    try {
      await transaction.submit(
        id.toString(),
        type,
        debitAccount,
        creditAccount,
        macAddress,
        amount
      );
      console.log('Orderer has accepted the transaction');
      state = 'ACCEPTED';
    } catch (ordererError) {
      console.error('Orderer rejected the transaction:', ordererError.message);
      state = 'REJECTED';
      return res.status(502).json({
        error: 'Transaction rejected by Ordering Service',
        details: ordererError.message
      });
    }

    // 5. RÃ©ponse succÃ¨s
    res.status(201).json({ success: true, transactionId: txId });

  } catch (error) {
    console.error('Error adding transaction:', error);
    state = 'REJECTED';
    res.status(500).json({ error: error.message });
  } finally {
    if (gateway) {
      gateway.disconnect();
    }
    await updateDB([currentUser, state, req.body.id]);
  }
});

app.post('/api/blockchain/delete', ensureAuth, async (req, res) => {
  let state = 'ACCEPTED';
  const currentUser = req.session.userId;
  try {
    console.log(req.body)
    const { id } = req.body;
    console.log(currentUser);
    // Connexion Ã  la blockchain
    const gateway = await connectGateway(currentUser);
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('operation_comptable');

    // ExÃ©cution de la transaction
    await contract.submitTransaction(
      'DeleteTransaction',
      id
    );

    gateway.disconnect();
    res.status(201).json({ success: true });

  } catch (error) {
    res.status(500).json({
      error: `Ã‰chec de la suppression: ${error.message}`,
      details: error.stack
    });
    console.log(`ERROR: Ã‰chec de la suppression: ${error.message}`)
    state = 'REJECTED';
  } finally {
    //writeAllIntoDB([currentUser, 'deleteProduct', JSON.stringify(req.body), state]);
  }
});

/**
 * @route GET /api/products
 * @description RÃ©cupÃ¨re tous les produits de la blockchain
 */
app.get('/api/blockchain/get', ensureAuth, async (req, res) => {
  const currentUser = req.session.userId;
  try {
    // Connexion avec l'identitÃ© admin par dÃ©faut
    const gateway = await connectGateway(currentUser);
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('operation_comptable');

    // Ã‰valuation de la transaction
    const result = await contract.evaluateTransaction('QueryAllTransactions');
    const products = JSON.parse(result.toString());

    gateway.disconnect();
    res.json(products);

  } catch (error) {
    res.status(500).json({
      error: `Erreur de lecture: ${error.message}`,
      blockchainError: error.responses ? error.responses.map(r => r.message) : null
    });
  }
});

app.get('/api/blockchain/read/:id', async (req, res) => {
  let state = "ACCEPTED";
  const userIdentity = 'admin'; // Ã€ remplacer par l'identitÃ© rÃ©elle
  try {
    const { id } = req.params;
    console.log(req.params);
    const gateway = await connectGateway(userIdentity);
    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('operation_comptable');

    // Ã‰valuation de la transaction (lecture seule)
    const result = await contract.evaluateTransaction('ReadTransaction', id);

    gateway.disconnect();

    if (!result || result.length === 0) {
      return res.status(404).json({ error: 'Transaction non trouvÃ©' });
    }

    const tx = JSON.parse(result.toString());
    res.json(tx);

  } catch (error) {
    state = "REJECTED";
    res.status(500).json({
      error: `Erreur lors de la rÃ©cupÃ©ration: ${error.message}`,
      details: error.stack
    });
  } finally {
    //await writeIntoDB([userIdentity, 'readProduct', JSON.stringify(req.body), state]);
  }
});

//Login route
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  try {
    // EnrÃ´lement auprÃ¨s du Fabric CA
    await enrollUser(username, password);
    // Stockage de l'identifiant dans la session
    console.log(`${username} vient de se connecter`)
    req.session.userId = username;
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(401).json({ error: 'Identifiants invalides: Vous n\'Ãªtes pas autorisÃ© Ã  Ã©crire dans la blockchain. veuillez contacter l\'administrateur' });
  }
});

app.post('/api/logout', (req, res) => {
  // 1) DÃ©truire la session cÃ´tÃ© serveur
  const currentUser = req.session.userId;
  console.log(`Deconnexion de ${currentUser}`);

  req.session.destroy(err => {
    if (err) {
      console.error('Erreur destruction sessionÂ :', err);
      return res.status(500).json({ error: 'Ã‰chec de la dÃ©connexion' });
    }
    // 2) Supprimer le cookie connect.sid cÃ´tÃ© client
    res.clearCookie('connect.sid');
    // 3) RÃ©pondre au client
    res.status(200).json({ message: 'DÃ©connectÃ© avec succÃ¨s' });
  });
  fs.unlink(`./wallet/${currentUser}.id`, (err) => {
    if (err) {
      console.error('Erreur suppression :', err.message);
      return;
    }
    console.log('Fichier supprimÃ© avec succÃ¨s');
  });
});

///DATABASE
app.get('/api/db/gettxs', async (req, res) => {
  try {
    const txs = await getTransactions();
    res.json(txs);

  } catch (error) {
    res.status(500).json({
      error: `Erreur de lecture: ${error.message}`,
    });
  }
});

app.get('/api/db/getentries/:txid', async (req, res) => {
  try {
    const entries = await getTransactionEntries(req.params.txid);
    res.json(entries);

  } catch (error) {
    res.status(500).json({
      error: `Erreur de lecture: ${error.message}`,
    });
  }
});

app.post('/api/db/transactions', async (req, res, next) => {
  const { type, debit_account_number, credit_account_number, amount, macAddress } = req.body;
  const client = await pg_connexion();
  console.log('Niveau 0', [type, debit_account_number, credit_account_number, amount, macAddress]);
  try {
    await client.query('BEGIN');

    // 1) table transaction
    const txRes = await client.query(
      `INSERT INTO "transaction"(type, amount, macAddress)
       VALUES($1, $2, $3)
       RETURNING id`,
      [type, amount, macAddress]
    );
    const txId = txRes.rows[0].id;

    // 2) lignes debit / credit
    await client.query(
      `INSERT INTO entry(transaction_id, account_id, entry_type, amount)
       VALUES
         ($1, $2, 'debit',  $3),
         ($1, $4, 'credit', $3)`,
      [txId, debit_account_number, amount, credit_account_number]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, transactionId: txId });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.end();
  }
});

//PLAN COMPTABLE
app.get('/api/db/accounts', async (req, res, next) => {
  const client = await pg_connexion();
  try {
    // RÃ©cupÃ¨re et parse le query param 'classes'
    const classes = (req.query.classes || '')
      .split(',')
      .map(n => parseInt(n, 10))
      .filter(Number.isInteger);

    // Si aucune classe, on renvoie un tableau vide
    if (classes.length === 0) {
      return res.json([]);
    }

    // RequÃªte vers PostgreSQL : sÃ©lection des comptes dont class âˆˆ classes
    const { rows } = await client.query(
      `SELECT
         account_number,
         label,
         class_number,
         type
       FROM account
       WHERE class_number = ANY($1::text[])
       ORDER BY account_number`,
      [classes]
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});


// GET /api/accounts?accountNumbers=401111,521111
app.get('/api/db/accountsLabel', async (req, res, next) => {
  const client = await pg_connexion();
  try {
    const nums = (req.query.accountNumbers || '')
      .split(',')
      .map(n => n.trim())
      .filter(n => n);
    if (nums.length === 0) {
      return res.status(400).json({ error: 'Le paramÃ¨tre accountNumbers est requis' });
    }
    const { rows } = await client.query(
      `SELECT account_number, label
         FROM account
        WHERE account_number = ANY($1::text[])
        ORDER BY account_number`,
      [nums]
    );
    return res.json(rows);
  } catch (err) {
    next(err);
  }
});


//login au niveau de la BD locale

app.post('/login-db', async (req, res) => {
  const { username, password } = req.body;
  const client = await pg_connexion();
  try {
    // RÃ©cupÃ©rer hash + mac depuis la BD
    const { rows } = await client.query(
      `SELECT password_hash, mac_address
             FROM users
            WHERE username = $1`,
      [username]
    );
    if (!rows.length) {
      return res.redirect('/login.html?error=' + encodeURIComponent('Utilisateur inconnu'));
    }
    const { password_hash, mac_address } = rows[0];
    const match = await bcrypt.compare(password, password_hash);
    if (!match) {
      return res.redirect('/login.html?error=' + encodeURIComponent('Mot de passe incorrect'));
    }
    // Auth OK â†’ stocker en session, puis rediriger vers la page principale
    req.session.dbUser = username;
    req.session.macAddress = mac_address;
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.redirect('/login.html?error=' + encodeURIComponent('Erreur serveur'));
  }
});


app.get('/api/session-db', (req, res) => {
  if (req.session.dbUser) {
    return res.json({
      username: req.session.dbUser,
      mac: req.session.macAddress
    });
  }
  return res.status(401).json({ error: 'Non authentifiÃ©' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.use(ensureDbAuth, express.static(path.join(__dirname, '../web-app')));

// Route de fallback
app.get('/', ensureDbAuth);
// ---------------------------------------------------------------
// DÃ©marrage du Serveur
// ---------------------------------------------------------------
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`API active sur http://localhost:${PORT}`);
});

// Gestion propre des arrÃªts

process.on('SIGINT', async () => {
  console.log('\nArrÃªt en coursâ€¦');
  await closeFabricListener();
  server.close(() => process.exit(0));
});

