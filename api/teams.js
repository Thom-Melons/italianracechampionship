const { neon } = require('@neondatabase/serverless');

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

function auth(event) {
  const h = event.headers.authorization || event.headers.Authorization || '';
  return h === process.env.ADMIN_PASSWORD;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const sql = neon(process.env.NETLIFY_DATABASE_URL);
  const params = event.queryStringParameters || {};

  try {
    if (event.httpMethod === 'GET') {
      const teams = await sql`SELECT * FROM teams ORDER BY name`;
      return { statusCode: 200, headers: CORS, body: JSON.stringify(teams) };
    }

    if (!auth(event)) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Non autorizzato' }) };

    if (event.httpMethod === 'POST') {
      const { name, color } = JSON.parse(event.body);
      const [t] = await sql`INSERT INTO teams (name, color) VALUES (${name}, ${color || '#888888'}) RETURNING *`;
      return { statusCode: 201, headers: CORS, body: JSON.stringify(t) };
    }

    if (event.httpMethod === 'PUT') {
      const { name, color } = JSON.parse(event.body);
      const [t] = await sql`UPDATE teams SET name=${name}, color=${color} WHERE id=${params.id} RETURNING *`;
      return { statusCode: 200, headers: CORS, body: JSON.stringify(t) };
    }

    if (event.httpMethod === 'DELETE') {
      await sql`DELETE FROM teams WHERE id=${params.id}`;
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
    }

  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
