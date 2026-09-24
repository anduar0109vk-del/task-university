const Usuario = require('../models/Usuario');
const { signToken, revokeToken, getCurrentUser } = require('../middleware/auth');
const pool = require('../config/database');

async function login(req, res) {
    const { nombre_usuario, correo_electronico, contrasena } = req.body || {};
    if ((!nombre_usuario && !correo_electronico) || !contrasena) return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    const user = await Usuario.findByLogin(nombre_usuario || correo_electronico);
    if (!user || !(await Usuario.bcrypt.compare(contrasena, user.contrasena_hash))) return res.status(401).json({ error: 'Credenciales inválidas' });
    if (!user.activo) return res.status(403).json({ error: 'La cuenta está inactiva' });
    const token = signToken(user);
    await pool.execute('INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, detalles) VALUES (?,?,?,?,?)',
        [user.id, 'LOGIN', 'usuarios', user.id, 'Inicio de sesión']);
    const { contrasena_hash, ...safe } = user;
    res.json({ token, usuario: safe, user: safe });
}
async function logout(req, res) {
    revokeToken(req.token);
    try { await pool.execute('INSERT INTO auditoria (usuario_id, accion, tabla_afectada, registro_id, detalles) VALUES (?,?,?,?,?)', [req.user.id, 'LOGOUT', 'usuarios', req.user.id, 'Cierre de sesión']); } catch (_) {}
    res.json({ message: 'Sesión cerrada correctamente' });
}
async function me(req, res) { const user = await getCurrentUser(req.user.id); if (!user) return res.status(404).json({ error: 'Usuario no encontrado' }); res.json({ data: user, usuario: user }); }
module.exports = { login, logout, me };