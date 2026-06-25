const KEYCLOAK_URL = 'http://localhost:8080';
const REALM = 'sso-demo';

async function testLogin(username, password) {
  // Use admin-cli because it allows direct access grants if configured, or just see what happens.
  // Wait, earlier I got "Client not allowed for direct access grants" for frontend-app.
  // I will test with 'admin-cli' client on 'sso-demo' realm, wait, admin-cli is in 'master' realm.
  
  // Actually, I can just use a simple fetch to Keycloak to see if credentials are valid.
  // The easiest way is to use the account-console client.
  const params = new URLSearchParams();
  params.append('client_id', 'account-console');
  params.append('username', username);
  params.append('password', password);
  params.append('grant_type', 'password');

  const res = await fetch(`${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`, {
    method: 'POST',
    body: params
  });
  
  if (!res.ok) {
    const data = await res.json();
    console.log(`Login failed: ${data.error_description}`);
  } else {
    console.log(`Login successful!`);
  }
}

testLogin('0037917693676320', '1980-03-02');
