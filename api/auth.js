const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };

  const { password } = JSON.parse(event.body || '{}');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'ADMIN_PASSWORD non configurata nelle variabili d\'ambiente Netlify' }) };

  if (password === adminPassword) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
  } else {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Password errata' }) };
  }
};
