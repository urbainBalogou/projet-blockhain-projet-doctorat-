const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const fs = require('fs');

async function main() {
    try {
        // Charger le profil de connexion de l'organisation (pour accÃ©der au CA)
        const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // CrÃ©er une instance du client CA Ã  partir du profil
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // CrÃ©er un wallet pour stocker l'identitÃ©
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // VÃ©rifier si l'identitÃ© admin existe dÃ©jÃ  dans le wallet
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('L\'identitÃ© "admin" existe dÃ©jÃ  dans le wallet');
            return;
        }

        // EnrÃ´ler l'administrateur
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };
        await wallet.put('admin', x509Identity);
        console.log('âœ… IdentitÃ© admin enregistrÃ©e avec succÃ¨s');

    } catch (error) {
        console.error(`âŒ Erreur lors de l'enregistrement: ${error}`);
        process.exit(1);
    }
}

main();
