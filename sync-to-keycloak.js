const fs = require('fs');
const path = require('path');

// Konfigurasi
const KEYCLOAK_URL = 'http://localhost:8080';
const REALM = 'sso-demo';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getAdminToken() {
  const params = new URLSearchParams();
  params.append('client_id', 'admin-cli');
  params.append('username', ADMIN_USER);
  params.append('password', ADMIN_PASS);
  params.append('grant_type', 'password');

  const res = await fetch(`${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
    method: 'POST',
    body: params
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Gagal mendapatkan token admin: ${error}`);
  }

  const data = await res.json();
  return data.access_token;
}

async function createUser(token, username, password, email, firstName, lastName) {
  const payload = {
    username: username,
    enabled: true,
    email: email,
    firstName: firstName,
    lastName: lastName,
    credentials: [
      {
        type: "password",
        value: password,
        temporary: false
      }
    ]
  };

  try {
    const res = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      if (res.status === 409) {
        return { status: 'exist', username };
      }
      const err = await res.text();
      return { status: 'error', username, error: err };
    }

    return { status: 'success', username };
  } catch (e) {
    return { status: 'error', username, error: e.message };
  }
}

function parseCSV(filename) {
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
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !inQuotes) {
      if (char === '\r') i++; // skip \n
      currentRow.push(currentField.trim());
      if (currentRow.length > 1 || currentRow[0] !== '') {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField !== '' || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.length > 1 || currentRow[0] !== '') rows.push(currentRow);
  }
  
  return rows.slice(1); // Exclude header
}

async function syncUsers(filename, identifierName, limit = 0) {
  console.log(`\n===========================================`);
  console.log(`Memulai sinkronisasi data dari ${filename}...`);
  console.log(`===========================================`);

  const data = parseCSV(filename);
  const rowsToProcess = limit > 0 ? data.slice(0, limit) : data;

  console.log(`Ditemukan ${data.length} baris data. Akan memproses ${rowsToProcess.length} data.`);

  try {
    let token = await getAdminToken();
    console.log(`Berhasil login ke Keycloak Admin CLI.\n`);

    let successCount = 0;
    let existCount = 0;
    let errorCount = 0;

    // Memproses data SATU PER SATU secara sequential agar Keycloak tidak crash
    const CONCURRENCY = 1;

    for (let i = 0; i < rowsToProcess.length; i += CONCURRENCY) {
      // Refresh token lebih sering (setiap 100 request) agar tidak terkena 401 Unauthorized
      if (i > 0 && i % 100 === 0) {
        token = await getAdminToken();
      }

      const batch = rowsToProcess.slice(i, i + CONCURRENCY);

      const promises = batch.map(row => {
        const username = row[0]; // NIK / NIP / NISN
        const password = row[2] ? row[2].replace(/-/g, '') : '123456';
        let email = row[3] || "";
        email = email.replace(/\.\.+/g, '.').replace(/^\./, '').replace(/\.@/, '@');
        
        const firstName = row[5] || row[1];
        const lastName = row[6] || "";

        return createUser(token, username, password, email, firstName, lastName);
      });

      const results = await Promise.all(promises);

      // Berikan sedikit jeda (delay) agar Keycloak tidak kelebihan beban CPU
      await delay(10);

      results.forEach(res => {
        if (res.status === 'success') successCount++;
        else if (res.status === 'exist') existCount++;
        else {
          errorCount++;
          console.error(`Error ${res.username}: ${res.error}`);
        }
      });

      // Print progress setiap 100 data
      if ((i + batch.length) % 100 === 0 || (i + batch.length) === rowsToProcess.length) {
        process.stdout.write(`\rProgress: ${i + batch.length}/${rowsToProcess.length} | Berhasil: ${successCount} | Sudah Ada: ${existCount} | Error: ${errorCount}`);
      }
    }

    console.log(`\n\nSelesai memproses ${filename}:`);
    console.log(`✅ Berhasil ditambahkan: ${successCount}`);
    console.log(`⏭️ Sudah ada di Keycloak: ${existCount}`);
    console.log(`❌ Gagal: ${errorCount}`);

  } catch (error) {
    console.error("Terjadi kesalahan:", error.message);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const target = args[0];
  
  if (!target || !['penduduk', 'asn', 'siswa'].includes(target)) {
    console.log("PENGGUNAAN: node sync-to-keycloak.js <pilihan>");
    console.log("Pilihan: penduduk, asn, atau siswa\n");
    console.log("Contoh: node sync-to-keycloak.js penduduk");
    return;
  }

  // Gunakan mode full (limit 0)
  const LIMIT = 0;

  if (target === 'penduduk') {
    await syncUsers('penduduk_8000.csv', 'NIK', LIMIT);
  } else if (target === 'asn') {
    await syncUsers('asn_8000.csv', 'NIP', LIMIT);
  } else if (target === 'siswa') {
    await syncUsers('siswa_8000.csv', 'NISN', LIMIT);
  }

  console.log("\nProses Selesai untuk data " + target);
}

main();
