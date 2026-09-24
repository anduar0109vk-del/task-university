require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(v => v.trim()) : true, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.get('/api/health', async (req, res) => {
    try { await pool.query('SELECT 1'); res.json({ status: 'ok' }); } catch (error) { res.status(503).json({ error: 'Base de datos no disponible' }); }
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tareas', require('./routes/tareasRoutes'));
app.use('/api/usuarios', require('./routes/usuariosRoutes'));
app.use('/api/categorias', require('./routes/categoriasRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use((error, req, res, next) => {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'El usuario o recurso ya existe' });
    if (error.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'Referencia relacionada inválida' });
    res.status(error.status || 500).json({ error: 'Error interno del servidor' });
});
const port = Number(process.env.PORT) || 4000;
if (require.main === module) app.listen(port, () => console.log(`API Task University ejecutándose en puerto ${port}`));
module.exports = app;