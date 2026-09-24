const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const publicFields = 'id, nombre_completo, nombre_usuario, correo_electronico, rol, activo, fecha_creacion';

async function findByLogin(login) {
    const [rows] = await pool.execute(`SELECT ${publicFields}, contrasena_hash FROM usuarios WHERE nombre_usuario = ? OR correo_electronico = ? LIMIT 1`, [login, login]);
    return rows[0] || null;
}
async function findById(id) {
    const [rows] = await pool.execute(`SELECT ${publicFields} FROM usuarios WHERE id = ? LIMIT 1`, [id]);
    return rows[0] || null;
}
async function list() { const [rows] = await pool.execute(`SELECT ${publicFields} FROM usuarios ORDER BY fecha_creacion DESC`); return rows; }
async function create(data) {
    const hash = await bcrypt.hash(data.contrasena, 10);
    const [result] = await pool.execute(
        'INSERT INTO usuarios (nombre_completo,nombre_usuario,correo_electronico,contrasena_hash,rol) VALUES (?,?,?,?,?)',
        [data.nombre_completo, data.nombre_usuario, data.correo_electronico, hash, data.rol || 'usuario']);
    return findById(result.insertId);
}
async function update(id, data) {
    const fields = [], values = [];
    ['nombre_completo', 'nombre_usuario', 'correo_electronico', 'rol'].forEach(k => { if (data[k] !== undefined) { fields.push(`${k} = ?`); values.push(data[k]); } });
    if (data.contrasena) { fields.push('contrasena_hash = ?'); values.push(await bcrypt.hash(data.contrasena, 10)); }
    if (!fields.length) return findById(id);
    values.push(id); await pool.execute(`UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`, values); return findById(id);
}
async function remove(id) { return pool.execute('DELETE FROM usuarios WHERE id = ?', [id]); }
module.exports = { bcrypt, findByLogin, findById, list, create, update, remove };