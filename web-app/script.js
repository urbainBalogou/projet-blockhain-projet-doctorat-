const API_URL = 'http://localhost:3000/api';
//const API_URL = 'http://localhost:3000/api';

var newID;

async function addTransaction(id) {
  // try {
  //   await loginFunc();
  // } catch (err) {
  //   console.warn(err);
  //   addTransaction(id);
  // }

  let isLoggedIn = false;
  while (!isLoggedIn) {
    try {
      await loginFunc();      // affiche le modal, rÃ©sout si OK, rejette si pas OK
      document.getElementById('errorMsg').textContent = '';
      isLoggedIn = true;      // identifiants valides : on sort de la boucle
    } catch (err) {
      // err.message contient le message dâ€™erreur affichÃ© dans le modal
      // on boucle de nouveau tant que lâ€™on nâ€™a pas rÃ©ussi
      document.getElementById('errorMsg').textContent = err.message;
      //alert(err.message)
    }
  }
  
  const tx = {
    id: id
  };
  //alert(JSON.stringify(product));
  console.log('idd', tx.id);

  try {
    const response = await fetch(`${API_URL}/blockchain/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tx)
    });

    const data = await response.json();
    console.log(data);
    console.log("DETAILS: ", data.details);
    if (!response.ok) {
      //throw new Error(`Erreur HTTP : ${response.status}`);
      throw new Error(`Transaction rejected: ${data.details}`);
    }

    await loadTransactions();
    document.getElementById(`td${id}`).style.backgroundColor = 'green';
    document.getElementById(`td${id}`).textContent = 'SUCCESS';
  } catch (error) {
    document.getElementById(`td${id}`).style.backgroundColor = '#a40f0f';
    document.getElementById(`td${id}`).textContent = 'FAILED';
    console.error('Erreur lors de l\'ajout de la transaction dans la blockchain :', error);
    customAlert(`Erreur lors de l'ajout de la transaction dans la blockchain:' ${error}`);
  }
}

//Chargement des transactions a partir de la db existante
async function loadTransactions() {
  try {
    const response = await fetch(`${API_URL}/db/gettxs`);

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const txs = await response.json();
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = '';

    txs.forEach(tx => {
      tbody.innerHTML += `
        <tr>
          <td>${tx.id}</td>
          <td>${tx.date}</td>
          <td>${tx.type}</td>
          <td>${tx.amount}</td>
          <td id="status${tx.id}" style="text-align: center;">${tx.status}</td>
        </tr>
      `;

      const stateLabel = document.getElementById(`status${tx.id}`);
      if(tx.status === 'ACCEPTED') {
        stateLabel.style.backgroundColor = 'green';
      } else if (tx.status === 'REJECTED') {
        stateLabel.style.backgroundColor = '#a40f0f';
      } else {
        stateLabel.innerHTML = 'En attente d\'envoie';
        stateLabel.style.backgroundColor = '#2196F3';
      }
    });
  } catch (error) {
    console.error('Erreur lors du chargement des transactions :', error);
  }
}

async function loadEntries() {
  try {
    const response = await fetch(`${API_URL}/db/getentries/${encodeURIComponent(document.getElementById('readID').value)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'                   // Ã©vite tout cache navigateur proxy
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const entries = await response.json();
    console.log(entries);
    const tbody = document.getElementById('tbody2');
    tbody.innerHTML = '';

    entries.forEach(ent => {
      tbody.innerHTML += `
        <tr>
          <td>${ent.id}</td>
          <td>${ent.account_id}</td>
          <td>${ent.label}</td>
          <td>${ent.entry_type}</td>
          <td>${ent.amount}</td>
        </tr>
      `;
    });
  } catch (error) {
    console.error('Erreur lors du chargement des details de la transaction :', error);
  }
}

// Chargement initial
loadTransactions();

async function deleteProduct() {
  const product = {
    productID: document.getElementById('deleteProductID').value
  }

  try {
    const response = await fetch(`${API_URL}/products/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Erreur : ${data.error}`);
    }

    await loadTransactions();
  } catch (error) {
    console.error('Erreur lors de la suppression de la transaction :', error);
    customAlert(`Erreur lors de la suppression de la transaction : ${error}`);
  }
}


async function getTransaction() {
  try {
    const response = await fetch(`${API_URL}/db/getentries/${encodeURIComponent(document.getElementById('readID').value)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'                   // Ã©vite tout cache navigateur proxy
    });

    const tx = await response.json();

    if (!response.ok) {
      throw new Error(`Erreur : ${tx.error}`);
    }

    const tbody = document.getElementById('tbody2');
    tbody.innerHTML = '';

    tbody.innerHTML += `
          <tr>
          <td>${tx.id}</td>
          <td>${tx.type}</td>
          <td>${tx.debitAccountNumber} â‚¬</td>
          <td>${tx.creditAccountNumber}</td>
          <td>${tx.amount}</td>
        </tr>
        `;
  } catch (error) {
    console.error('Erreur lors du chargement de la transaction :', error);
    customAlert(`Erreur lors du chargement de la transaction : ${error}`);
  }
}

//------------------------------------------------------------------
function showSection(sectionId) {
  document.querySelectorAll('section').forEach(sec => {
    sec.classList.toggle('section-active', sec.id === sectionId);
  });
}

var macp;

window.addEventListener('load', async () => {
  try {
    const resp = await fetch('/api/session-db', { credentials: 'include' });
    if (!resp.ok) throw new Error('Session invalide');
    const { username, mac } = await resp.json();
    // Affiche un message de bienvenue
    //alert(`Bienvenue ${username}â€¯! Votre adresse MACâ€¯: ${mac}`);
    // Et on peut l'injecter aussi dans la page si besoin
    document.getElementById('userName').textContent = username;
    macp = document.getElementById('mac').value      = mac;
    logoutBtn.style.display = 'flex';
  } catch (err) {
    console.error('Impossible de rÃ©cupÃ©rer la session :', err);
  }
});

// RÃ©cupÃ©ration des Ã©lÃ©ments
//const openBtn = document.getElementById('openModalBtn');
const modal = document.getElementById('loginModal');
const closeBtn = document.getElementById('closeModalBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Ferme le modal quand on clique sur la croix
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Ferme si on clique en dehors de la boÃ®te de dialogue
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Soumission du formulaire
async function loginFunc() {
  modal.style.display = 'flex';
  //document.getElementById('errorMsg').textContent = '';
  return new Promise((resolve, reject) => {
    const form = document.getElementById('loginForm');

    const onSubmit = async (e) => {
      e.preventDefault();
      const { username, password } = e.target;

      try {
        const resp = await fetch(`${API_URL}/login`, {
          method: 'POST',
          credentials: 'include',               // â† IMPORTANT
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username: username.value, 
            password: password.value 
          })
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error);

        // SuccÃ¨s : on nettoie tout
        form.removeEventListener('submit', onSubmit);
        modal.style.display = 'none';
        //document.getElementById('userName').textContent = username.value;
        resolve();
      } catch (err) {
        // Affiche lâ€™erreur sans toucher aux listeners
        //document.getElementById('errorMsg').textContent = err.message;
        console.error('Erreur loginFunc:', err);
        reject(err);
      }
    };

    form.addEventListener('submit', onSubmit);
  });
}



//logout
logoutBtn.addEventListener('click', async () => {
  try {
    const resp = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include',           // pour envoyer le cookie de session
      headers: { 'Content-Type': 'application/json' }
    });
    if (!resp.ok) throw new Error('Ã‰chec de la dÃ©connexion');
    // Masquer le bouton et recharger/rediriger
    logoutBtn.style.display = 'none';
    window.location.href = '/';    // ou recharger la page
  } catch (err) {
    console.error('Logout error:', err);
    alert('Impossible de se dÃ©connecter pour le moment.');
  }
});

function customAlert(message) {
  const modal2 = document.getElementById('custom-alert');
  const content = modal2.querySelector('.modal-content2');
  const msgEl = document.getElementById('custom-message');
  const okBtn = document.getElementById('custom-ok');

  // 1) Mettre Ã  jour le message
  msgEl.textContent = message;

  // 2) Afficher la modal en flex
  modal2.style.display = 'flex';

  // 3) Forcer un reflow pour rÃ©initialiser la transition
  //    sans cela, la classe .show ne relanÃ§ait pas la transition
  void content.offsetWidth;       // forcer reflow :contentReference[oaicite:2]{index=2}

  // 4) Ajouter la classe .show pour dÃ©clencher la transition
  modal2.classList.add('show');

  // 5) Gestion du click sur OK
  okBtn.onclick = () => {
    // Retirer la classe pour lancer la transition de fermeture
    modal2.classList.remove('show');

    // Masquer aprÃ¨s la durÃ©e de la transition
    setTimeout(() => {
      modal2.style.display = 'none';
    }, 300);  // correspond Ã  0.3s de transition :contentReference[oaicite:3]{index=3}
  };
}


//------------------------------------------------------------------

const form       = document.getElementById('op-form');
const opType     = document.getElementById('op-type');
const fields     = document.getElementById('account-fields');
const debitAcct  = document.getElementById('debit-account');
const creditAcct = document.getElementById('credit-account');

// Comptes fixes selon type
const fixed = {
  depense: { debit: '401111', credit: '521111' },
  recette: { debit: '511111', credit: '411111' }
};

opType.addEventListener('change', async () => {
  const type = opType.value;
  if (!type) {
    fields.style.display = 'none';
    debitAcct.innerHTML = creditAcct.innerHTML = '<option>--Compte--</option>';
    return;
  }

  fields.style.display = 'block';
  const { debit, credit } = fixed[type];

  // Fetch pour rÃ©cupÃ©rer le label
  const res = await fetch(
    `/api/db/accountsLabel?accountNumbers=${debit},${credit}`
  );
  const list = res.ok ? await res.json() : [];

  // Remplir le select DÃ©bit
  const d = list.find(a => a.account_number === debit);
  debitAcct.innerHTML = `<option value="${debit}">`
    + (d ? `${debit} â€“ ${d.label}` : debit)
    + `</option>`;

  // Remplir le select CrÃ©dit
  const c = list.find(a => a.account_number === credit);
  creditAcct.innerHTML = `<option value="${credit}">`
    + (c ? `${credit} â€“ ${c.label}` : credit)
    + `</option>`;
});

form.addEventListener('submit', async e => {
  e.preventDefault();
  const payload = {
    type: opType.value,
    debit_account_number: debitAcct.value,
    credit_account_number: creditAcct.value,
    macAddress: document.getElementById('mac').value,
    amount: document.getElementById('amount').value
  };
  console.log(payload);
  const resp = await fetch('/api/db/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (resp.ok) {
    const { transactionId } = await resp.json();
    customAlert('Ã‰criture enregistrÃ©e ! ID : ' + transactionId);
    form.reset();
    document.getElementById('mac').value      = macp;
    fields.style.display = 'none';
    debitAcct.innerHTML = creditAcct.innerHTML = '<option>--Compte--</option>';

    const tbody = document.getElementById('tbody0');
    //tbody.innerHTML = '';

    tbody.innerHTML += `
          <tr>
            <td>${transactionId}</td>
            <td>${payload.type}</td>
            <td>${payload.debit_account_number}</td>
            <td>${payload.credit_account_number}</td>
            <td>${payload.amount}</td>
            <td style="text-align: center;"><button id="td${transactionId}" onclick="addTransaction(${transactionId})">Envoyer</button></td>
          </tr>
        `;

    await loadTransactions();
  } else {
    const err = await resp.json();
    customAlert('Erreur: ' + (err.message || resp.statusText));
  }
});
