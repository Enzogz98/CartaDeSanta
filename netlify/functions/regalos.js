import mysql from 'mysql2/promise';

// Configuración de la conexión (igual que antes)
const db = mysql.createPool({
  host: "borci3zcz6t8xhrki1g5-mysql.services.clever-cloud.com",
  user: 'ubafmq4ypwbbc65r',
  password: '6nYbdLfjrZD66kFobA8E',
  database: 'borci3zcz6t8xhrki1g5',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default async (req) => {
  // Headers para evitar problemas de CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS"
  };

  // Manejar preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  const url = new URL(req.url); // Para leer query params

  try {
    // --- GET: Obtener regalos ---
    if (req.method === 'GET') {
      const persona = url.searchParams.get('persona');
      const [rows] = await db.query('SELECT * FROM Regalos WHERE persona = ?', [persona]);
      
      return new Response(JSON.stringify(rows), {
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    // --- POST: Agregar regalo ---
    if (req.method === 'POST') {
      const body = await req.json(); // Leemos el body así en Netlify
      const { nomRegalo, persona } = body;
      
      const [result] = await db.query('INSERT INTO Regalos (nomRegalo, persona) VALUES (?, ?)', [nomRegalo, persona]);
      
      return new Response(JSON.stringify({ id: result.insertId, nomRegalo, persona }), {
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    // --- DELETE: Borrar regalo ---
    if (req.method === 'DELETE') {
      const id = url.searchParams.get('id');
      await db.query('DELETE FROM Regalos WHERE id = ?', [id]);
      
      return new Response(JSON.stringify({ message: 'Eliminado' }), {
        headers: { ...headers, "Content-Type": "application/json" }
      });
    }

    return new Response("Método no permitido", { status: 405, headers });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...headers, "Content-Type": "application/json" }
    });
  }
};