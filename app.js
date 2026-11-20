const USERS_URL = 'https://jsonplaceholder.typicode.com/users';

const loadBtn = document.getElementById('loadBtn');
const searchInput = document.getElementById('searchInput');
const usersList = document.getElementById('usersList');
const postsTitle = document.getElementById('postsTitle');
const postsList = document.getElementById('postsList');
const messageEl = document.getElementById('message');

let allUsers = [];
let loading = false;

function setMessage(text, type = 'info') {
  messageEl.textContent = text;
  messageEl.className = 'message ' + type;
}

function clearMessage() {
  messageEl.textContent = '';
  messageEl.className = 'message';
}

function renderUsers(users) {
  usersList.innerHTML = '';
  if (users.length === 0) {
    usersList.innerHTML = '<div class="no-results">Пользователи не найдены</div>';
    return;
  }
  users.forEach(user => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
      <div class="user-info">
        <h3>${user.name}</h3>
        <p>Email: ${user.email}</p>
        <p>Город: ${user.address.city}</p>
      </div>
      <button class="user-btn" data-id="${user.id}" data-name="${user.name}">Показать публикации</button>
    `;
    usersList.appendChild(card);
  });
}

function renderPosts(posts) {
  postsList.innerHTML = '';
  if (posts.length === 0) {
    postsList.innerHTML = '<p>Нет публикаций</p>';
    return;
  }
  posts.slice(0, 3).forEach(post => {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `<h4>${post.title}</h4><p>${post.body}</p>`;
    postsList.appendChild(card);
  });
}

async function loadUsers() {
  if (loading) return;
  loading = true;
  loadBtn.disabled = true;
  setMessage('Загрузка...', 'info');
  try {
    const response = await fetch(USERS_URL);
    if (!response.ok) {
      throw new Error('Ошибка загрузки: ' + response.status);
    }
    allUsers = await response.json();
    renderUsers(allUsers);
    clearMessage();
  } catch (err) {
    setMessage(err.message, 'error');
  } finally {
    loading = false;
    loadBtn.disabled = false;
  }
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = allUsers.filter(user =>
    user.name.toLowerCase().includes(query)
  );
  renderUsers(filtered);
});

usersList.addEventListener('click', async (e) => {
  if (!e.target.classList.contains('user-btn')) return;
  if (loading) return;

  const btn = e.target;
  const userId = btn.dataset.id;
  const userName = btn.dataset.name;

  loading = true;
  btn.disabled = true;
  postsTitle.textContent = `Публикации пользователя ${userName}:`;
  postsList.innerHTML = '';
  setMessage('Загрузка публикаций...', 'info');

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Ошибка загрузки публикаций: ' + response.status);
    }
    const posts = await response.json();
    renderPosts(posts);
    clearMessage();
  } catch (err) {
    setMessage(err.message, 'error');
    postsList.innerHTML = '';
  } finally {
    loading = false;
    btn.disabled = false;
  }
});

loadBtn.addEventListener('click', loadUsers);