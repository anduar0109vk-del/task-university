const pool = require('../config/database');
async function index(req, res) {
    const scope = req.user.rol === 'admin' ? '' : ' WHERE usuario_id = ?';
    const args = req.user.rol === 'admin' ? [] : [req.user.id];
    const [rows] = await pool.execute(`SELECT COUNT(*) total, SUM(estado = 'completada') completadas, SUM(estado <> 'completada') pendientes, SUM(estado = 'en_progreso') en_progreso FROM tareas${scope}`, args);
    const stats = rows[0] || {};
    res.json({ data: { total: Number(stats.total || 0), completadas: Number(stats.completadas || 0), pendientes: Number(stats.pendientes || 0), en_progreso: Number(stats.en_progreso || 0) }, ...stats });
}
async function audit(req, res) { if (req.user.rol !== 'admin') return res.status(403).json({ error: 'Se requiere rol administrador' }); const [rows] = await pool.execute('SELECT a.*, u.nombre_usuario FROM auditoria a LEFT JOIN usuarios u ON u.id = a.usuario_id ORDER BY a.fecha_creacion DESC LIMIT 200'); res.json({ data: rows }); }
module.exports = { index, audit };