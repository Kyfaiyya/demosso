const API_BASE = 'http://localhost:4003';

// Notification System
function showNotif(message, type = 'success') {
  const notif = document.getElementById('notification');
  const msg = document.getElementById('notifMessage');
  
  notif.className = `notification show ${type}`;
  msg.innerHTML = message;
  
  setTimeout(() => {
    notif.className = 'notification';
  }, 4000);
}

// Tab Switching
function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(`${tabName}Tab`).classList.add('active');

  // Load data based on tab
  if (tabName === 'users') loadUsers();
  else if (tabName === 'organizations') loadOrgs();
  else if (tabName === 'audit') loadAudit();
}

// Check API Health
async function checkHealth() {
  const badge = document.getElementById('apiStatus');
  const dot = badge.querySelector('.status-dot');
  const text = badge.querySelector('span');

  try {
    const res = await fetch(`${API_BASE}/`);
    if (res.ok) {
      dot.classList.add('online');
      text.textContent = 'API Online';
    } else {
      throw new Error('API Offline');
    }
  } catch (err) {
    dot.classList.remove('online');
    text.textContent = 'API Offline';
  }
}

// --- USERS ---
async function loadUsers() {
  const tbody = document.querySelector('#usersTable tbody');
  try {
    const res = await fetch(`${API_BASE}/users`);
    const users = await res.json();
    
    tbody.innerHTML = '';
    if (users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">No users found</td></tr>';
      return;
    }

    users.forEach(user => {
      let statusBadge = '';
      if (user.status === 'ACTIVE') statusBadge = '<span class="badge badge-active">Active</span>';
      else if (user.status === 'INACTIVE') statusBadge = '<span class="badge badge-inactive">Inactive</span>';
      else statusBadge = '<span class="badge badge-deleted">Deleted</span>';

      let actionBtn = user.status === 'ACTIVE' 
        ? `<button class="btn btn-sm btn-danger" onclick="toggleUserStatus('${user.id}', 'disable')">Disable</button>`
        : `<button class="btn btn-sm btn-success" onclick="toggleUserStatus('${user.id}', 'activate')">Activate</button>`;

      tbody.innerHTML += `
        <tr>
          <td><strong>${user.fullName}</strong><br><small style="color:var(--text-secondary)">${user.nik || '-'}</small></td>
          <td>${user.email}</td>
          <td>${statusBadge}</td>
          <td>${actionBtn}</td>
        </tr>
      `;
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--danger-color)">Failed to load users</td></tr>';
  }
}

document.getElementById('createUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('btnSubmitUser');
  btn.textContent = 'Creating...';
  btn.disabled = true;

  const payload = {
    nik: document.getElementById('nik').value || undefined,
    nip: document.getElementById('nip').value || undefined,
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value || undefined,
  };

  try {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) throw new Error(await res.text());
    
    showNotif('User created & synced to Keycloak!', 'success');
    e.target.reset();
    loadUsers();
  } catch (err) {
    showNotif('Failed to create user', 'error');
    console.error(err);
  } finally {
    btn.textContent = 'Create User & Sync';
    btn.disabled = false;
  }
});

async function toggleUserStatus(id, action) {
  try {
    const res = await fetch(`${API_BASE}/users/${id}/${action}`, { method: 'PATCH' });
    if (!res.ok) throw new Error('Failed');
    showNotif(`User successfully ${action}d!`, 'success');
    loadUsers();
  } catch (err) {
    showNotif(`Failed to ${action} user`, 'error');
  }
}

// --- ORGANIZATIONS ---
async function loadOrgs() {
  const tbody = document.querySelector('#orgsTable tbody');
  try {
    const res = await fetch(`${API_BASE}/organizations`);
    const orgs = await res.json();
    
    tbody.innerHTML = '';
    orgs.forEach(org => {
      tbody.innerHTML += `
        <tr>
          <td><strong>${org.name}</strong></td>
          <td>${org.description || '-'}</td>
        </tr>
      `;
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="2" style="text-align:center">Failed to load</td></tr>';
  }
}

document.getElementById('createOrgForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const payload = {
    name: document.getElementById('orgName').value,
    description: document.getElementById('orgDesc').value || undefined,
  };

  try {
    const res = await fetch(`${API_BASE}/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) throw new Error('Failed');
    
    showNotif('Organization added!', 'success');
    e.target.reset();
    loadOrgs();
  } catch (err) {
    showNotif('Failed to add organization', 'error');
  }
});

// --- AUDIT LOGS ---
async function loadAudit() {
  const tbody = document.querySelector('#auditTable tbody');
  try {
    const res = await fetch(`${API_BASE}/audit-logs`);
    const logs = await res.json();
    
    tbody.innerHTML = '';
    logs.forEach(log => {
      const date = new Date(log.timestamp).toLocaleString();
      tbody.innerHTML += `
        <tr>
          <td style="color:var(--text-secondary)">${date}</td>
          <td><span class="badge badge-inactive">${log.actor}</span></td>
          <td style="color:var(--primary-color); font-weight:500;">${log.action}</td>
          <td><small>${log.target}</small></td>
        </tr>
      `;
    });
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Failed to load logs</td></tr>';
  }
}

// Initialize
checkHealth();
loadUsers();
setInterval(checkHealth, 10000); // Ping every 10s
