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
    // GET — public
    if (event.httpMethod === 'GET') {
      const drivers = params.category
        ? await sql`SELECT * FROM drivers WHERE category = ${params.category} AND active = true ORDER BY name`
        : await sql`SELECT * FROM drivers WHERE active = true ORDER BY category, name`;
      return { statusCode: 200, headers: CORS, body: JSON.stringify(drivers) };
    }

    // Write operations require auth
    if (!auth(event)) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Non autorizzato' }) };

    if (event.httpMethod === 'POST') {
      const { name, team, number, category, flag } = JSON.parse(event.body);
      const [d] = await sql`INSERT INTO drivers (name, team, number, category, flag)
        VALUES (${name}, ${team || null}, ${number || null}, ${category}, ${flag || '🇮🇹'}) RETURNING *`;
      return { statusCode: 201, headers: CORS, body: JSON.stringify(d) };
    }

    if (event.httpMethod === 'PUT') {
      const { name, team, number, flag, active } = JSON.parse(event.body);
      const [d] = await sql`UPDATE drivers SET name=${name}, team=${team||null}, number=${number||null}, flag=${flag||'🇮🇹'}, active=${active!==false}
        WHERE id=${params.id} RETURNING *`;
      return { statusCode: 200, headers: CORS, body: JSON.stringify(d) };
    }

    if (event.httpMethod === 'DELETE') {
      await sql`UPDATE drivers SET active=false WHERE id=${params.id}`;
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
    }

  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
