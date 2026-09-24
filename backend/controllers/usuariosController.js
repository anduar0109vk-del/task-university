const Usuario = require('../models/Usuario');
const pool = require('../config/database');
const audit = async (req, action, id, details) => { try { await pool.execute('INSERT INTO auditoria (usuario_id,accion,tabla_afectada,registro_id,detalles) VALUES (?,?,?,?,?)', [req.user.id, action, 'usuarios', id || null, details || null]); } catch (_) {} };
async function index(req, res) { res.json({ data: await Usuario.list() }); }
async function show(req, res) { const user = await Usuario.findById(req.params.id); if (!user) return res.status(404).json({ error: 'Usuario no encontrado' }); res.json({ data: user }); }
async function create(req, res) {
    const { nombre_completo, nombre_usuario, correo_electronico, contrasena, rol } = req.body || {};
    if (!nombre_completo || !nombre_usuario || !correo_electronico || !contrasena) return res.status(400).json({ error: 'Faltan campos obligatorios' });
    const user = await Usuario.create({ nombre_completo, nombre_usuario, correo_electronico, contrasena, rol }); await audit(req, 'CREATE', user.id); res.status(201).json({ data: user });
}
async function update(req, res) { const user = await Usuario.update(req.params.id, req.body || {}); if (!user) return res.status(404).json({ error: 'Usuario no encontrado' }); await audit(req, 'UPDATE', user.id); res.json({ data: user }); }
async function remove(req, res) { if (String(req.params.id) === String(req.user.id)) return res.status(400).json({ error: 'No puede eliminar su propio usuario' }); const user = await Usuario.findById(req.params.id); if (!user) return res.status(404).json({ error: 'Usuario no encontrado' }); await Usuario.remove(req.params.id); await audit(req, 'DELETE', req.params.id); res.json({ message: 'Usuario eliminado' }); }
module.exports = { index, show, create, update, remove };