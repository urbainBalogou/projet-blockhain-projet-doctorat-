const { Client } = require('pg');
const fs = require('fs');
const csv = require('csv-parser');

// Config DB
const client = new Client({
  user: 'djibril',
  host: 'localhost',
  database: 'HISTORIQUE',
  password: 'blockchain',
  port: 5432,
});

// Classes SYSCOHADA officielles
const CLASSES = {
  '1': 'Financement Permanent',
  '2': 'Actif ImmobilisÃ©',
  '3': 'Stocks et En-cours',
  '4': 'Tiers',
  '5': 'TrÃ©sorerie',
  '6': 'Charges',
  '7': 'Produits',
  '8': 'RÃ©sultats',
  '9': 'Engagements et Comptes SpÃ©ciaux'
};

async function importCSV() {
  try {
    await client.connect();

    // 1. InsÃ©rer les classes
    for(const [classNum, label] of Object.entries(CLASSES)) {
      await client.query(`
        INSERT INTO account_class (class_number, label)
        VALUES ($1, $2)
        ON CONFLICT (class_number) DO NOTHING
      `, [classNum, label]);
    }

    // 2. Lire et parser le CSV
    const accounts = [];
    
    fs.createReadStream('plan_comptable.csv')
      .pipe(csv({
        separator: ';', // Adapter selon votre CSV
        headers: ['Numero_compte', 'Libelles'], // Nommer vos colonnes
	skipLines: 1
      }))
      .on('data', (row) => {
        if(row.Numero_compte) {
          accounts.push({
            number: row.Numero_compte.trim(),
            label: row.Libelles.trim(),
            class: row.Numero_compte.trim()[0] // Classe = premier caractÃ¨re
          });
        }
      })
      .on('end', async () => {
        // 3. InsÃ©rer les comptes
	 // console.log('Comptes Ã  insÃ©rer :', accounts); // Affiche les donnÃ©es
        for(const account of accounts) {
	  console.log(account);
          await client.query(`
            INSERT INTO account (account_number, label, class_number)
            VALUES ($1, $2, $3)
            ON CONFLICT (account_number) DO NOTHING
          `, [account.number, account.label, account.class]);
        }
        
        console.log(`${accounts.length} comptes importÃ©s âœ…`);
        await client.end();
      });

  } catch (error) {
    console.error('Erreur:', error);
    await client.end();
  }
}

// ExÃ©cuter
importCSV();

