const pool = require('../config/database');
async function list() { const [rows] = await pool.execute('SELECT * FROM categorias ORDER BY nombre'); return rows; }
async function find(id) { const [rows] = await pool.execute('SELECT * FROM categorias WHERE id = ?', [id]); return rows[0] || null; }
async function create(data) { const [r] = await pool.execute('INSERT INTO categorias (nombre,color) VALUES (?,?)', [data.nombre, data.color || '#6366f1']); return find(r.insertId); }
async function update(id, data) { await pool.execute('UPDATE categorias SET nombre = ?, color = ? WHERE id = ?', [data.nombre, data.color || '#6366f1', id]); return find(id); }
async function remove(id) { return pool.execute('DELETE FROM categorias WHERE id = ?', [id]); }
module.exports = { list, find, create, update, remove };