const { neon } = require('@neondatabase/serverless');

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
      const races = params.category
        ? await sql`SELECT * FROM races WHERE category=${params.category} ORDER BY round`
        : await sql`SELECT * FROM races ORDER BY category, round`;
      return { statusCode: 200, headers: CORS, body: JSON.stringify(races) };
    }

    if (!auth(event)) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Non autorizzato' }) };

    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body);
      const [r] = await sql`UPDATE races SET
        round        = ${body.round},
        name         = ${body.name},
        circuit      = ${body.circuit},
        race_date    = ${body.race_date},
        flag_emoji   = ${body.flag_emoji},
        is_done      = ${body.is_done ?? false},
        double_points= ${body.double_points ?? false}
        WHERE id=${params.id} RETURNING *`;
      return { statusCode: 200, headers: CORS, body: JSON.stringify(r) };
    }

  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
