const KEYCLOAK_URL = 'http://localhost:8080';
const REALM = 'sso-demo';

async function checkUser(username) {
  const params = new URLSearchParams();
  params.append('client_id', 'admin-cli');
  params.append('username', 'admin');
  params.append('password', 'admin123');
  params.append('grant_type', 'password');

  const res = await fetch(`${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`, {
    method: 'POST',
    body: params
  });
  const data = await res.json();
  const token = data.access_token;

  const userRes = await fetch(`${KEYCLOAK_URL}/admin/realms/${REALM}/users?username=${username}&exact=true`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const users = await userRes.json();
  console.log(JSON.stringify(users, null, 2));
}

checkUser('0037917693676320');
