const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');

async function enrollUser(enrollID, enrollSecret) {
  try {
    // 1) Charger le profile de connexion
    const ccpPath = path.resolve(
      __dirname, '..', 'fabric-samples', 'test-network',
      'organizations', 'peerOrganizations',
      'org1.example.com', 'connection-org1.json'
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // 2) Instancier le client CA
    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca    = new FabricCAServices(caURL);

    // 3) Charger (ou crÃ©er) le wallet
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet     = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // 4) VÃ©rifier si l'identitÃ© existe dÃ©jÃ 
    const identity = await wallet.get(enrollID);
    if (identity) {
      console.log(`L'identitÃ© ${enrollID} existe dÃ©jÃ  dans le wallet`);
      // âž” On vÃ©rifie juste les credentials :
      try {
        await ca.enroll({ enrollmentID: enrollID, enrollmentSecret: enrollSecret });
        console.log(`âœ”ï¸ Identifiants valides pour ${enrollID}, pas de nouvel enrollement`);
        return; // Tout est OK, on ne rÃ©-Ã©crit pas dans le wallet
      } catch (err) {
        console.error(`âŒ Ã‰chec de la validation des identifiants pour ${enrollID}:`, err);
        throw new Error('Identifiants invalides');
      }
    }

    // 5) Sinon, on n'a pas l'identitÃ© : on tente l'enrollment
    console.log(`Enregistrement de l'identitÃ© ${enrollID} dans le walletâ€¦`);
    const enrollment = await ca.enroll({
      enrollmentID:     enrollID,
      enrollmentSecret: enrollSecret
    });

    // 6) PrÃ©parer lâ€™identitÃ© X.509 et stocker dans le wallet
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey:  enrollment.key.toBytes()
      },
      mspId: 'Org1MSP',
      type:  'X.509'
    };
    await wallet.put(enrollID, x509Identity);
    console.log(`âœ… IdentitÃ© ${enrollID} enregistrÃ©e avec succÃ¨s`);

  } catch (error) {
    console.error(`âŒ Erreur lors de enrollUser('${enrollID}') :`, error);
    throw error;
  }
}

function ensureAuth(req, res, next) {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Non authentifiÃ©' });
    }
    next();
}


module.exports = { enrollUser, ensureAuth }

