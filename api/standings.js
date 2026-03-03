const { neon } = require('@neondatabase/serverless');

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

const PTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const sql = neon(process.env.NETLIFY_DATABASE_URL);
  const category = (event.queryStringParameters || {}).category || 'F1';

  try {
    const rows = await sql`
      SELECT
        rr.position, rr.fastest_lap,
        r.double_points,
        d.id as driver_id, d.name, d.team, d.flag, d.number
      FROM race_results rr
      JOIN races r ON rr.race_id = r.id
      JOIN drivers d ON rr.driver_id = d.id
      WHERE r.category = ${category} AND r.is_done = true AND d.active = true
    `;

    const map = {};
    for (const row of rows) {
      if (!map[row.driver_id]) {
        map[row.driver_id] = { driver_id: row.driver_id, name: row.name, team: row.team, flag: row.flag, number: row.number, points: 0, wins: 0, podiums: 0 };
      }
      let pts = row.position <= 10 ? PTS[row.position - 1] : 0;
      if (row.fastest_lap && row.position <= 10) pts += 1;
      if (row.double_points) pts *= 2;
      map[row.driver_id].points += pts;
      if (row.position === 1) map[row.driver_id].wins++;
      if (row.position <= 3) map[row.driver_id].podiums++;
    }

    const sorted = Object.values(map).sort((a, b) => b.points - a.points || b.wins - a.wins);
    return { statusCode: 200, headers: CORS, body: JSON.stringify(sorted) };
  } catch (err) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: err.message }) };
  }
};
