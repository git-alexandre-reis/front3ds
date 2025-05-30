//const apiUrl = 'https://api-infonet.onrender.com/api/users'; // Altere a porta se necessário
const apiUrl = 'http://localhost:8081/api/users';

document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();

  const form = document.getElementById('userForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    const user = {
      name: document.getElementById('name').value,
      document: document.getElementById('document').value,
      email: document.getElementById('email').value,
      birthday: document.getElementById('birthday').value
    };

    if (userId) {
      // Atualiza
      await fetch(`${apiUrl}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    } else {
      // Cria novo
      await fetch(`${apiUrl}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    }

    form.reset();
    document.getElementById('userId').value = '';
    fetchUsers();
  });
});

async function fetchUsers() {
  const response = await fetch(`${apiUrl}/`);
  const users = await response.json();
  const tbody = document.querySelector('#usersTable tbody');

  tbody.innerHTML = '';

  users.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.document}</td>
      <td>${user.email}</td>
      <td>${user.birthday}</td>
      <td>
        <button onclick="editUser(${user.id})">Editar</button>
        <button onclick="deleteUser(${user.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function editUser(id) {
  const response = await fetch(`${apiUrl}/${id}`);
  const user = await response.json();

  document.getElementById('userId').value = user.id;
  document.getElementById('name').value = user.name;
  document.getElementById('document').value = user.document;
  document.getElementById('email').value = user.email;
  document.getElementById('birthday').value = user.birthday.split('T')[0]; // Ajuste para input date
}

async function deleteUser(id) {
  if (confirm('Tem certeza que deseja excluir este usuário?')) {
    await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    fetchUsers();
  }
}
