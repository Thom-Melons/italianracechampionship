const { neon } = require('@neondatabase/serverless');

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

const RACES = [
  // F1 - Venerdì
  { round: 1,  name: "Gran Premio d'Australia",      circuit: "Albert Park Circuit",         date: "Venerdì, 6 Mar 2026 — 21:00",   category: "F1", double_points: false, flag: "🇦🇺" },
  { round: 2,  name: "Gran Premio della Cina",        circuit: "Shanghai International",       date: "Venerdì, 20 Mar 2026 — 21:00",  category: "F1", double_points: false, flag: "🇨🇳" },
  { round: 3,  name: "Gran Premio del Giappone",      circuit: "Suzuka International",         date: "Venerdì, 3 Apr 2026 — 21:00",   category: "F1", double_points: false, flag: "🇯🇵" },
  { round: 4,  name: "Gran Premio di Bahrain",        circuit: "Bahrain International",        date: "Venerdì, 17 Apr 2026 — 21:00",  category: "F1", double_points: true,  flag: "🇧🇭" },
  { round: 5,  name: "Gran Premio di Monaco",         circuit: "Circuit de Monaco",            date: "Venerdì, 8 Mag 2026 — 21:00",   category: "F1", double_points: false, flag: "🇲🇨" },
  { round: 6,  name: "Gran Premio di Spagna",         circuit: "Circuit de Catalunya",         date: "Venerdì, 22 Mag 2026 — 21:00",  category: "F1", double_points: false, flag: "🇪🇸" },
  { round: 7,  name: "Gran Premio del Canada",        circuit: "Circuit Gilles Villeneuve",    date: "Venerdì, 5 Giu 2026 — 21:00",   category: "F1", double_points: false, flag: "🇨🇦" },
  { round: 8,  name: "Gran Premio di Gran Bretagna",  circuit: "Silverstone Circuit",          date: "Venerdì, 3 Lug 2026 — 21:00",   category: "F1", double_points: false, flag: "🇬🇧" },
  { round: 9,  name: "Gran Premio d'Ungheria",        circuit: "Hungaroring",                  date: "Venerdì, 17 Lug 2026 — 21:00",  category: "F1", double_points: false, flag: "🇭🇺" },
  { round: 10, name: "Gran Premio d'Italia",          circuit: "Autodromo di Monza",           date: "Venerdì, 4 Set 2026 — 21:00",   category: "F1", double_points: false, flag: "🇮🇹" },
  { round: 11, name: "Gran Premio di Abu Dhabi",      circuit: "Yas Marina Circuit",           date: "Venerdì, 27 Nov 2026 — 21:00",  category: "F1", double_points: false, flag: "🇦🇪" },
  // F2 - Giovedì
  { round: 1,  name: "Gran Premio d'Australia",      circuit: "Albert Park Circuit",         date: "Giovedì, 5 Mar 2026 — 21:00",   category: "F2", double_points: false, flag: "🇦🇺" },
  { round: 2,  name: "Gran Premio della Cina",        circuit: "Shanghai International",       date: "Giovedì, 19 Mar 2026 — 21:00",  category: "F2", double_points: false, flag: "🇨🇳" },
  { round: 3,  name: "Gran Premio del Giappone",      circuit: "Suzuka International",         date: "Giovedì, 2 Apr 2026 — 21:00",   category: "F2", double_points: false, flag: "🇯🇵" },
  { round: 4,  name: "Gran Premio di Bahrain",        circuit: "Bahrain International",        date: "Giovedì, 16 Apr 2026 — 21:00",  category: "F2", double_points: true,  flag: "🇧🇭" },
  { round: 5,  name: "Gran Premio di Monaco",         circuit: "Circuit de Monaco",            date: "Giovedì, 7 Mag 2026 — 21:00",   category: "F2", double_points: false, flag: "🇲🇨" },
  { round: 6,  name: "Gran Premio di Spagna",         circuit: "Circuit de Catalunya",         date: "Giovedì, 21 Mag 2026 — 21:00",  category: "F2", double_points: false, flag: "🇪🇸" },
  { round: 7,  name: "Gran Premio del Canada",        circuit: "Circuit Gilles Villeneuve",    date: "Giovedì, 4 Giu 2026 — 21:00",   category: "F2", double_points: false, flag: "🇨🇦" },
  { round: 8,  name: "Gran Premio di Gran Bretagna",  circuit: "Silverstone Circuit",          date: "Giovedì, 2 Lug 2026 — 21:00",   category: "F2", double_points: false, flag: "🇬🇧" },
  { round: 9,  name: "Gran Premio d'Ungheria",        circuit: "Hungaroring",                  date: "Giovedì, 16 Lug 2026 — 21:00",  category: "F2", double_points: false, flag: "🇭🇺" },
  { round: 10, name: "Gran Premio d'Italia",          circuit: "Autodromo di Monza",           date: "Giovedì, 3 Set 2026 — 21:00",   category: "F2", double_points: false, flag: "🇮🇹" },
  { round: 11, name: "Gran Premio di Abu Dhabi",      circuit: "Yas Marina Circuit",           date: "Giovedì, 26 Nov 2026 — 21:00",  category: "F2", double_points: false, flag: "🇦🇪" },
  // F3 - Martedì
  { round: 1,  name: "Gran Premio d'Australia",      circuit: "Albert Park Circuit",         date: "Martedì, 3 Mar 2026 — 21:00",   category: "F3", double_points: false, flag: "🇦🇺" },
  { round: 2,  name: "Gran Premio della Cina",        circuit: "Shanghai International",       date: "Martedì, 17 Mar 2026 — 21:00",  category: "F3", double_points: false, flag: "🇨🇳" },
  { round: 3,  name: "Gran Premio del Giappone",      circuit: "Suzuka International",         date: "Martedì, 31 Mar 2026 — 21:00",  category: "F3", double_points: false, flag: "🇯🇵" },
  { round: 4,  name: "Gran Premio di Bahrain",        circuit: "Bahrain International",        date: "Martedì, 14 Apr 2026 — 21:00",  category: "F3", double_points: true,  flag: "🇧🇭" },
  { round: 5,  name: "Gran Premio di Monaco",         circuit: "Circuit de Monaco",            date: "Martedì, 5 Mag 2026 — 21:00",   category: "F3", double_points: false, flag: "🇲🇨" },
  { round: 6,  name: "Gran Premio di Spagna",         circuit: "Circuit de Catalunya",         date: "Martedì, 19 Mag 2026 — 21:00",  category: "F3", double_points: false, flag: "🇪🇸" },
  { round: 7,  name: "Gran Premio del Canada",        circuit: "Circuit Gilles Villeneuve",    date: "Martedì, 2 Giu 2026 — 21:00",   category: "F3", double_points: false, flag: "🇨🇦" },
  { round: 8,  name: "Gran Premio di Gran Bretagna",  circuit: "Silverstone Circuit",          date: "Martedì, 30 Giu 2026 — 21:00",  category: "F3", double_points: false, flag: "🇬🇧" },
  { round: 9,  name: "Gran Premio d'Ungheria",        circuit: "Hungaroring",                  date: "Martedì, 14 Lug 2026 — 21:00",  category: "F3", double_points: false, flag: "🇭🇺" },
  { round: 10, name: "Gran Premio d'Italia",          circuit: "Autodromo di Monza",           date: "Martedì, 1 Set 2026 — 21:00",   category: "F3", double_points: false, flag: "🇮🇹" },
  { round: 11, name: "Gran Premio di Abu Dhabi",      circuit: "Yas Marina Circuit",           date: "Martedì, 24 Nov 2026 — 21:00",  category: "F3", double_points: false, flag: "🇦🇪" },
];

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };

  const auth = event.headers.authorization || event.headers.Authorization || '';
  if (auth !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'Non autorizzato' }) };
  }

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    await sql`CREATE TABLE IF NOT EXISTS teams (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      color VARCHAR(20) DEFAULT '#888888',
      created_at TIMESTAMP DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS drivers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      team VARCHAR(100),
      number VARCHAR(10),
      category VARCHAR(5) NOT NULL,
      flag VARCHAR(10) DEFAULT '🇮🇹',
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS races (
      id SERIAL PRIMARY KEY,
      round INTEGER NOT NULL,
      name VARCHAR(200) NOT NULL,
      circuit VARCHAR(200),
      race_date VARCHAR(100),
      category VARCHAR(5) NOT NULL,
      is_done BOOLEAN DEFAULT false,
      double_points BOOLEAN DEFAULT false,
      flag_emoji VARCHAR(10) DEFAULT '🏁',
      created_at TIMESTAMP DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS race_results (
      id SERIAL PRIMARY KEY,
      race_id INTEGER REFERENCES races(id) ON DELETE CASCADE,
      driver_id INTEGER REFERENCES drivers(id) ON DELETE CASCADE,
      position INTEGER NOT NULL,
      fastest_lap BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(race_id, driver_id)
    )`;

    // Seed teams only if table is empty
    const existingTeams = await sql`SELECT COUNT(*) as count FROM teams`;
    if (parseInt(existingTeams[0].count) === 0) {
      const defaultTeams = [
        { name: 'Ferrari',       color: '#e8002d' },
        { name: 'McLaren',       color: '#FF8000' },
        { name: 'Red Bull',      color: '#3671C6' },
        { name: 'Mercedes',      color: '#27F4D2' },
        { name: 'Aston Martin',  color: '#229971' },
        { name: 'Alpine',        color: '#FF87BC' },
        { name: 'Williams',      color: '#64C4FF' },
        { name: 'Haas',          color: '#B6BABD' },
        { name: 'Kick Sauber',   color: '#52E252' },
        { name: 'Racing Bulls',  color: '#6692FF' },
      ];
      for (const t of defaultTeams) {
        await sql`INSERT INTO teams (name, color) VALUES (${t.name}, ${t.color}) ON CONFLICT (name) DO NOTHING`;
      }
    }

    // Seed races only if table is empty
    const existing = await sql`SELECT COUNT(*) as count FROM races`;
    if (parseInt(existing[0].count) === 0) {
      for (const r of RACES) {
        await sql`INSERT INTO races (round, name, circuit, race_date, category, double_points, flag_emoji)
                  VALUES (${r.round}, ${r.name}, ${r.circuit}, ${r.date}, ${r.category}, ${r.double_points}, ${r.flag})`;
      }
    }

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: true, message: 'Database inizializzato con successo!' }) };
  } catch (error) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: error.message }) };
  }
};
