const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const revokedTokens = new Set();

function signToken(user) {
    return jwt.sign({ id: user.id, rol: user.rol, nombre_usuario: user.nombre_usuario },
        process.env.JWT_SECRET || 'task-university-development-secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
}

function authenticate(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Token requerido' });
    if (revokedTokens.has(token)) return res.status(401).json({ error: 'Sesión cerrada' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'task-university-development-secret');
        req.token = token;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.rol !== 'admin') return res.status(403).json({ error: 'Se requiere rol administrador' });
    next();
}

function revokeToken(token) { if (token) revokedTokens.add(token); }

async function getCurrentUser(id) {
    const [rows] = await pool.execute(
        'SELECT id, nombre_completo, nombre_usuario, correo_electronico, rol, activo, fecha_creacion FROM usuarios WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
}

module.exports = { authenticate, requireAdmin, signToken, revokeToken, getCurrentUser };