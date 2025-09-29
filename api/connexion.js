const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const { Client } = require("pg");
require("dotenv").config();

// Construction du profil de connexion pour Org1
const buildCCPOrg1 = () => {
    const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    return JSON.parse(ccpJSON); // Charge la configuration rÃ©seau
};

// Gestion du portefeuille d'identitÃ©s
const buildWallet = async (walletPath) => {
    return await Wallets.newFileSystemWallet(walletPath); // Stockage local des certificats
};

// Connexion sÃ©curisÃ©e au gateway Fabric
const connectGateway = async (userName) => {
    const ccp = buildCCPOrg1();
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await buildWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, { // Ã‰tablissement de la connexion
        wallet,
        identity: userName,
        discovery: { enabled: true, asLocalhost: true }
    });

    return gateway; // Gateway connectÃ© pour les transactions
};


//Connexion sÃ©curisÃ©e a la BD
const pg_connexion = async () => {
    const client = new Client({
        user: 'djibril',
        host: 'localhost',
        database: 'HISTORIQUE',
        password: process.env.PASSWORD,
        port: 5432
    });
    client.connect()
        .then(() => console.log('ConnectÃ© Ã  la base de donnÃ©es PostgreSQL'))
        .catch(err => console.error('Erreur de connexion Ã  la base de donnÃ©es', err))

    return client;
}

//Requetes BD
const readArgsFromDB = async (id) => {
    // On rÃ©cupÃ¨re un client connectÃ©
    const client = await pg_connexion();

    // On retourne une promesse pour englober le callback de client.query
    return new Promise((resolve, reject) => {
        client.query(
            `SELECT
            t.id,
            t.type,
            e.entry_type,
            e.account_id,
            a.label     AS account_label,
            t.amount,
            t.macaddress
            FROM "transaction" AS t
            JOIN entry AS e
            ON t.id = e.transaction_id
            JOIN account AS a
            ON e.account_id = a.account_number
            WHERE t.id = $1
            ORDER BY e.entry_type DESC`,
            [id],
            (err, res) => {
                // On ferme la connexion dans tous les cas
                client
                    .end()
                    .then(() => console.log('Connexion fermÃ©e'))
                    .catch(e => console.error('Erreur lors de la fermeture :', e.stack));

                if (err) {
                    console.error(err);
                    return reject(err);
                }

                // Vos affichages de texte, tels quâ€™Ã©crits initialement
                const data = res.rows;
                let finalData = {}, debitAccount, creditAccount;
                data.forEach(element => {
                    if (element.entry_type == 'debit') {
                        debitAccount = element.account_id;
                    } else if (element.entry_type == 'credit') {
                        creditAccount = element.account_id;
                    }
                });
                finalData = { id, type: data[0].type, debitAccount, creditAccount, amount: data[0].amount, macAddress: data[0].macaddress }
                resolve(finalData)
            }
        );
    });
};


const updateDB = async (data) => {
    const client = await pg_connexion();

    client.query(`UPDATE transaction SET username = $1, status = $2 WHERE id = $3`, data, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log('DonnÃ©es mises a jour avec succÃ¨s !');
        }

        client.end()
            .then(() => console.log('Connexion fermÃ©e'))
            .catch(e => console.error('Erreur lors de la fermeture :', e.stack));
    })
}


const getTransactions = async () => {
    const client = await pg_connexion();

    return new Promise((resolve, reject) => {

        client.query(`SELECT id, date, type, amount, status FROM transaction`, (err, res) => {
            if (err) {
                console.error(err);
                return reject(err);
            } else {
                const data = res.rows;
                resolve(data);
            }

            client.end()
                .then(() => console.log('Connexion fermÃ©e'))
                .catch(e => console.error('Erreur lors de la fermeture :', e.stack));
        })
    })
}


const getTransactionEntries = async (txid) => {
    const client = await pg_connexion();

    return new Promise((resolve, reject) => {

        client.query(
            `SELECT E.id, E.account_id, A.label, E.entry_type, E.amount FROM entry AS E
        JOIN account AS A
        ON E.account_id = A.account_number
        WHERE transaction_id = $1`,
            [txid],
            (err, res) => {
                if (err) {
                    console.error(err);
                    return reject(err);
                } else {
                    const data = res.rows;
                    resolve(data);
                }

                client.end()
                    .then(() => console.log('Connexion fermÃ©e'))
                    .catch(e => console.error('Erreur lors de la fermeture :', e.stack));
            })
    })
}


async function read() {
    console.log(await readArgsFromDB(38))
}

//read()



module.exports = {
    pg_connexion, connectGateway,
    updateDB, readArgsFromDB, getTransactions,
    getTransactionEntries
};

