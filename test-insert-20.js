const fs = require('fs');
const path = require('path');

const KEYCLOAK_URL = 'http://localhost:8080';
const REALM = 'sso-demo';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getAdminToken() {
  const params = new URLSearchParams();
  params.append('client_id', 'admin-cli');
  params.append('username', ADMIN_USER);
  params.append('password', ADMIN_PASS);
  params.append('grant_type', 'password');

  const res = await fetch(`${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
    method: 'POST', body: params
  });

  if (!res.ok) throw new Error("Gagal dapat token");
  return (await res.json()).access_token;
}

// Map nama group ke ID agar mudah dimasukkan
async function getGroups(token) {
  const res = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/groups`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) return {};
  const groups = await res.json();
  const groupMap = {};
  groups.forEach(g => groupMap[g.name] = g.id);
  return groupMap;
}

async function createUserAndJoinGroup(token, username, password, email, firstName, lastName, groupId, groupName) {
  const payload = {
    username, enabled: true, email: email, firstName: firstName, lastName: lastName,
    credentials: [{ type: "password", value: password, temporary: false }],
    groups: [groupName] // Assign to group directly on creation (if supported)
  };

  try {
    const res = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status === 409) return { status: 'exist', username };
    if (!res.ok) return { status: 'error', username, error: await res.text() };

    // Get user id to explicitly join group if the payload groups didn't work
    if (groupId) {
       const userRes = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users?username=${username}&exact=true`, {
         headers: { 'Authorization': `Bearer ${token}` }
       });
       if (userRes.ok) {
         const users = await userRes.json();
         if (users.length > 0) {
            await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users/${users[0].id}/groups/${groupId}`, {
              method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
            });
         }
       }
    }

    return { status: 'success', username };
  } catch (e) {
    return { status: 'error', username, error: e.message };
  }
}

function parseCSV(filename, limit) {
  const content = fs.readFileSync(path.join(__dirname, filename), 'utf-8');
  const rows = [];
  let inQuotes = false;
  let currentField = '';
  let currentRow = [];
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i+1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
      if (char === '\r') i++;
      currentRow.push(currentField.trim());
      if (currentRow.length > 1 || currentRow[0] !== '') {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
      // Limit check (header is row 0)
      if (limit > 0 && rows.length > limit) break;
    } else {
      currentField += char;
    }
  }
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.length > 1 || currentRow[0] !== '') rows.push(currentRow);
  }
  
  const dataRows = rows.slice(1); // skip header
  return limit > 0 ? dataRows.slice(0, limit) : dataRows;
}

async function main() {
  console.log("=== Memulai Script Insert 20 Data Percobaan & Assign Group ===");
  try {
    const token = await getAdminToken();
    const groupMap = await getGroups(token);
    
    console.log("Groups yang tersedia di Keycloak:", Object.keys(groupMap).join(", "));

    const tasks = [
      { file: 'penduduk_8000.csv', group: 'Admin Dukcapil', app: 'Dukcapil' },
      { file: 'asn_8000.csv',      group: 'Admin Kominfo', app: 'Kominfo' },
      { file: 'siswa_8000.csv',    group: 'Admin Pendidikan', app: 'Pendidikan' }
    ];

    for (const task of tasks) {
      console.log(`\nMemproses 20 data dari ${task.file} (App: ${task.app}) -> Masuk Group: ${task.group}`);
      const data = parseCSV(task.file, 20);
      const groupId = groupMap[task.group];
      
      let success = 0, exist = 0, errors = 0;

      for (const row of data) {
        const username = row[0]; // NIK/NIP/NISN
        const password = row[2] ? row[2].replace(/-/g, '') : '123456';
        let email = row[3] || "";
        email = email.replace(/\.\.+/g, '.').replace(/^\./, '').replace(/\.@/, '@');
        
        const firstName = row[5] || row[1];
        const lastName = row[6] || "";

        const res = await createUserAndJoinGroup(token, username, password, email, firstName, lastName, groupId, task.group);
        if (res.status === 'success') success++;
        else if (res.status === 'exist') exist++;
        else { errors++; console.error(` Error ${username}:`, res.error); }
        
        await delay(10);
      }
      
      console.log(` Selesai ${task.app}: ${success} berhasil dibuat, ${exist} sudah ada, ${errors} error.`);
    }

    // Buat juga beberapa Superadmin untuk ngetes
    console.log("\nMembuat 3 Superadmin Test...");
    for (let i = 1; i <= 3; i++) {
      const res = await createUserAndJoinGroup(token, `super_tester${i}`, "admin123", `super${i}@example.go.id`, "Super Tester", `${i}`, groupMap['Superadmin'], "Superadmin");
      console.log(` Superadmin ${i}: ${res.status}`);
    }

    console.log("\n✅ Semua proses selesai!");
  } catch (err) {
    console.error("Terjadi kesalahan sistem:", err.message);
  }
}

main();
