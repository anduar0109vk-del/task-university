const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function seed() {
    try {
        const hash = await bcrypt.hash('Admin123!', 10);
        
        await pool.execute(
            `INSERT INTO usuarios (nombre_completo, nombre_usuario, correo_electronico, contrasena_hash, rol) 
             VALUES (?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE contrasena_hash = ?`,
            ['Administrador del Sistema', 'admin', 'admin@taskuniversity.edu', hash, 'admin', hash]
        );
        
        console.log('Usuario administrador creado exitosamente');
        console.log('Usuario: admin');
        console.log('Contrasena: Admin123!');
        process.exit(0);
    } catch (error) {
        console.error('Error al crear usuario administrador:', error);
        process.exit(1);
    }
}

seed();