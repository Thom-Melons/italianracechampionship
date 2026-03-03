const { neon } = require('@neondatabase/serverless');

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
      if (params.race_id) {
        const results = await sql`
          SELECT rr.*, d.name as driver_name, d.team, d.flag, d.number
          FROM race_results rr
          JOIN drivers d ON rr.driver_id = d.id
          WHERE rr.race_id = ${params.race_id}
          ORDER BY rr.position`;
        return { statusCode: 200, headers: CORS, body: JSON.stringify(results) };
      }
      return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'race_id richiesto' }) };
    }

    if (!auth(event)) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Non autorizzato' }) };

    if (event.httpMethod === 'POST') {
      // body: { race_id, results: [{driver_id, position, fastest_lap}] }
      const { race_id, results } = JSON.parse(event.body);

      // Delete existing results for this race
      await sql`DELETE FROM race_results WHERE race_id = ${race_id}`;

      // Insert new results
      for (const r of results) {
        if (!r.driver_id || !r.position) continue;
        await sql`INSERT INTO race_results (race_id, driver_id, position, fastest_lap)
          VALUES (${race_id}, ${r.driver_id}, ${r.position}, ${r.fastest_lap || false})`;
      }

      // Mark race as completed
      await sql`UPDATE races SET is_done = true WHERE id = ${race_id}`;

      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true }) };
    }

  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
