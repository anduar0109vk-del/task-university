const pool = require('../config/database');
const select = `SELECT t.*, c.nombre AS categoria_nombre, c.color AS categoria_color
 FROM tareas t LEFT JOIN categorias c ON c.id = t.categoria_id`;
async function list(user, filters = {}) {
    const where = [], values = [];
    if (user.rol !== 'admin') { where.push('t.usuario_id = ?'); values.push(user.id); }
    else if (filters.usuario_id) { where.push('t.usuario_id = ?'); values.push(filters.usuario_id); }
    if (filters.estado) { where.push('t.estado = ?'); values.push(filters.estado); }
    if (filters.prioridad) { where.push('t.prioridad = ?'); values.push(filters.prioridad); }
    if (filters.categoria_id) { where.push('t.categoria_id = ?'); values.push(filters.categoria_id); }
    if (filters.q) { where.push('(t.titulo LIKE ? OR t.descripcion LIKE ?)'); values.push(`%${filters.q}%`, `%${filters.q}%`); }
    const [rows] = await pool.execute(`${select}${where.length ? ` WHERE ${where.join(' AND ')}` : ''} ORDER BY t.fecha_limite IS NULL, t.fecha_limite ASC, t.fecha_creacion DESC`, values);
    return rows;
}
async function find(id) { const [rows] = await pool.execute(`${select} WHERE t.id = ?`, [id]); return rows[0] || null; }
async function create(data, userId) {
    const [r] = await pool.execute('INSERT INTO tareas (usuario_id,titulo,descripcion,prioridad,estado,fecha_limite,categoria_id) VALUES (?,?,?,?,?,?,?)',
        [userId, data.titulo, data.descripcion || null, data.prioridad || 'media', data.estado || 'pendiente', data.fecha_limite || null, data.categoria_id || null]);
    return find(r.insertId);
}
async function update(id, data, user) {
    const task = await find(id); if (!task) return null;
    if (user.rol !== 'admin' && task.usuario_id !== user.id) return false;
    const fields = [], values = [];
    ['titulo', 'descripcion', 'prioridad', 'estado', 'fecha_limite', 'categoria_id'].forEach(k => { if (data[k] !== undefined) { fields.push(`${k} = ?`); values.push(data[k] || null); } });
    if (fields.length) { values.push(id); await pool.execute(`UPDATE tareas SET ${fields.join(', ')} WHERE id = ?`, values); }
    return find(id);
}
async function remove(id, user) {
    const task = await find(id); if (!task) return null;
    if (user.rol !== 'admin' && task.usuario_id !== user.id) return false;
    await pool.execute('DELETE FROM tareas WHERE id = ?', [id]); return task;
}
module.exports = { list, find, create, update, remove };