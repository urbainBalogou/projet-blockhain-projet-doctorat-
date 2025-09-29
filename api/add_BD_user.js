// create_user.js

const { pg_connexion } = require('./connexion');
const bcrypt           = require('bcrypt');
const crypto           = require('crypto');

/**
 * GÃ©nÃ¨re une MAC alÃ©atoire au format AA:BB:CC:DD:EE:FF
 */
function generateRandomMac() {
  const bytes = crypto.randomBytes(6);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join(':')
    .toUpperCase();
}

/**
 * Vide la table users
 */
async function clearUsers() {
  const client = await pg_connexion();
  try {
    await client.query('TRUNCATE TABLE users;');
    console.log('Table users vidÃ©e avec succÃ¨s.');
  } catch (err) {
    console.error('Erreur lors du vidage de usersâ€¯:', err.message);
  } finally {
    await client.end();
  }
}

/**
 * CrÃ©e un utilisateur avec mot de passe hashÃ© et MAC alÃ©atoire
 */
async function createUser(username, plainPassword) {
  const client = await pg_connexion();
  const mac    = generateRandomMac();
  const hash   = await bcrypt.hash(plainPassword, 10);

  const query  = `
    INSERT INTO users(username, password_hash, mac_address)
    VALUES ($1, $2, $3)
    RETURNING username, mac_address
  `;
  const values = [username, hash, mac];

  try {
    const res = await client.query(query, values);
    console.log('User crÃ©Ã© :', res.rows[0]);
  } catch (err) {
    console.error('Erreur insertion userâ€¯:', err.message);
  } finally {
    await client.end();
  }
}

/**
 * CLI dispatcher
 */
async function main() {
  const [,, action, username, password] = process.argv;

  switch (action) {
    case 'reset':
      await clearUsers();
      break;

    case 'create':
      if (!username || !password) {
        console.error('Usage: node create_user.js create <username> <password>');
        process.exit(1);
      }
      await createUser(username, password);
      break;

    default:
      console.error(
        'Usage:\n' +
        '  node create_user.js reset                     # vide la table users\n' +
        '  node create_user.js create <user> <password>  # crÃ©e un utilisateur'
      );
      process.exit(1);
  }

  process.exit(0);
}

if (require.main === module) {
  main();
}

