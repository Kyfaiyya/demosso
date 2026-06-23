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

async function createUser(token, username, name, password) {
  const payload = {
    username: username,
    enabled: true,
    firstName: name, // Menyimpan nama di field firstName
    credentials: [
      {
        type: "password",
        value: password,
        temporary: false
      }
    ]
  };

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
}

function parseCSV(filename) {
  const content = fs.readFileSync(path.join(__dirname, filename), 'utf-8');
  const lines = content.trim().split('\n');
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parser
    const parts = line.split(',');
    // Clean quotes if any
    const values = parts.map(p => p.replace(/^"|"$/g, '').trim());
    rows.push(values);
  }
  return rows;
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

    // Untuk menghindari rate limiting atau membebani Keycloak, kita proses dengan batch kecil (concurrency = 10)
    const CONCURRENCY = 10;
    
    for (let i = 0; i < rowsToProcess.length; i += CONCURRENCY) {
      // Refresh token setiap 500 request agar tidak expired (401 Unauthorized)
      if (i > 0 && i % 500 === 0) {
        token = await getAdminToken();
      }

      const batch = rowsToProcess.slice(i, i + CONCURRENCY);
      
      const promises = batch.map(row => {
        const username = row[0]; // NIK / NIP / NISN
        const name = row[1];     // Nama
        // Hapus tanda strip pada tanggal lahir untuk dijadikan password
        const password = row[2] ? row[2].replace(/-/g, '') : '123456'; 
        
        return createUser(token, username, name, password);
      });

      const results = await Promise.all(promises);
      
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
  // Default process first 100 just to test. Set limit to 0 for all.
  const LIMIT = args.includes('--all') ? 0 : 50; 
  
  if (!args.includes('--all')) {
    console.log("INFO: Mode percobaan! Hanya 50 data pertama per file yang akan disinkronkan.");
    console.log("Untuk sinkronkan semua (24.000 data), jalankan: node sync-to-keycloak.js --all\n");
  }

  // 1. Sinkronisasi Penduduk (Dukcapil)
  await syncUsers('penduduk_8000.csv', 'NIK', LIMIT);
  
  // 2. Sinkronisasi ASN (Kominfo)
  await syncUsers('asn_8000.csv', 'NIP', LIMIT);

  // 3. Sinkronisasi Siswa (Layanan Pendidikan)
  await syncUsers('siswa_8000.csv', 'NISN', LIMIT);

  console.log("\nProses Sinkronisasi Selesai!");
}

main();
