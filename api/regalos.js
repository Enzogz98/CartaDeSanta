import mysql from 'mysql2/promise';

// Usamos createPool para manejar conexiones automáticamente
const db = mysql.createPool({
  host: 'borci3zcz6t8xhrki1g5-mysql.services.clever-cloud.com',
  user: 'ubafmq4ypwbbc65r',       // REEMPLAZAR
  password: '6nYbdLfjrZD66kFobA8E',  // REEMPLAZAR
  database: 'borci3zcz6t8xhrki1g5',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default async function handler(req, res) {
  // Configurar CORS para permitir peticiones desde tu web
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // --- GET: Obtener regalos ---
    if (req.method === 'GET') {
      const { persona } = req.query;
      const [rows] = await db.query('SELECT * FROM Regalos WHERE persona = ?', [persona]);
      return res.status(200).json(rows);
    }

    // --- POST: Agregar regalo ---
    if (req.method === 'POST') {
      const { nomRegalo, persona } = req.body;
      const [result] = await db.query('INSERT INTO Regalos (nomRegalo, persona) VALUES (?, ?)', [nomRegalo, persona]);
      return res.status(200).json({ id: result.insertId, nomRegalo, persona });
    }

    // --- DELETE: Borrar regalo ---
    if (req.method === 'DELETE') {
      const { id } = req.query; // En serverless a veces el ID viene en query o body según config
      await db.query('DELETE FROM Regalos WHERE id = ?', [id]);
      return res.status(200).json({ message: 'Eliminado' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}