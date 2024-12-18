import { pool } from "../db.js";

export const getProductos = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.*, 
                pr.nombre AS proveedor_nombre, 
                pr.numero_seguidores, 
                pr.productos_vendidos, 
                pr.productos_asociados, 
                pr.ranking,
                c.nombre AS categoria_nombre,
                c.parent_id AS categoria_parent_id,
                cp.nombre AS categoria_padre_nombre
            FROM productos p
            JOIN proveedores pr ON p.proveedor_id = pr.id
            JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN categorias cp ON c.parent_id = cp.id
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
}

// Controlador para obtener un producto por ID
export const getProductoById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT 
                p.*, 
                pr.nombre AS proveedor_nombre, 
                pr.numero_seguidores, 
                pr.productos_vendidos, 
                pr.productos_asociados, 
                pr.ranking,
                c.nombre AS categoria_nombre,
                c.parent_id AS categoria_parent_id,
                cp.nombre AS categoria_padre_nombre
            FROM productos p
            JOIN proveedores pr ON p.proveedor_id = pr.id
            JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN categorias cp ON c.parent_id = cp.id
            WHERE p.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
};

// Controlador para marcar un producto como favorito
export const marcarFavorito = async (req, res) => {
    const { usuario_id, producto_id } = req.body;

    try {
        // Verificar si el usuario existe
        const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [usuario_id]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el producto existe
        const [productRows] = await pool.query('SELECT * FROM productos WHERE id = ?', [producto_id]);
        if (productRows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verificar si el producto ya está marcado como favorito
        const [favoriteRows] = await pool.query('SELECT * FROM favoritos WHERE usuario_id = ? AND producto_id = ?', [usuario_id, producto_id]);
        if (favoriteRows.length > 0) {
            // Actualizar la fecha si ya está marcado como favorito
            await pool.query('UPDATE favoritos SET fecha_agregado = CURRENT_TIMESTAMP WHERE usuario_id = ? AND producto_id = ?', [usuario_id, producto_id]);
            return res.status(200).send({ message: 'Fecha de favorito actualizada' });
        }

        // Insertar el producto como favorito
        await pool.query('INSERT INTO favoritos (usuario_id, producto_id) VALUES (?, ?)', [usuario_id, producto_id]);

        res.status(200).send({ message: 'Producto marcado como favorito' });
    } catch (error) {
        console.error('Error al marcar el producto como favorito:', error);
        res.status(500).json({ message: error.message });
    }
};

// Controlador para devolver los productos favoritos de un usuario
export const obtenerFavoritos = async (req, res) => {
    const { usuario_id } = req.params;

    try {
        // Verificar si el usuario existe
        const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [usuario_id]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Obtener los productos favoritos del usuario
        const [rows] = await pool.query(`
            SELECT p.*
            FROM productos p
            JOIN favoritos f ON p.id = f.producto_id
            WHERE f.usuario_id = ?
        `, [usuario_id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos favoritos para este usuario' });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error al obtener los productos favoritos:', error);
        res.status(500).json({ message: error.message });
    }
};

// Controlador para eliminar un producto favorito de un usuario
export const eliminarFavorito = async (req, res) => {
    const { usuario_id, producto_id } = req.params;

    try {
        // Verificar si el usuario existe
        const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [usuario_id]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el producto existe
        const [productRows] = await pool.query('SELECT * FROM productos WHERE id = ?', [producto_id]);
        if (productRows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Eliminar el producto favorito del usuario
        await pool.query('DELETE FROM favoritos WHERE usuario_id = ? AND producto_id = ?', [usuario_id, producto_id]);

        res.status(200).json({ message: 'Producto eliminado de favoritos' });
    } catch (error) {
        console.error('Error al eliminar el producto de favoritos:', error);
        res.status(500).json({ message: error.message });
    }
};

// Crear una reseña de un producto
export const crearReseña = async (req, res) => {
    const { producto_id, texto, calificacion, usuario_id } = req.body;

    try {
        // Verificar si el usuario existe
        const [userRows] = await pool.query('SELECT * FROM users WHERE id = ?', [usuario_id]);
        if (userRows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el producto existe
        const [productRows] = await pool.query('SELECT * FROM productos WHERE id = ?', [producto_id]);
        if (productRows.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Insertar la reseña en la base de datos
        await pool.query(
            'INSERT INTO reseñas (usuario_id, producto_id, calificacion, comentario) VALUES (?, ?, ?, ?)',
            [usuario_id, producto_id, calificacion, texto]
        );

        res.status(201).json({ message: 'Reseña creada exitosamente' });
    } catch (error) {
        console.error('Error al crear la reseña:', error);
        res.status(500).json({ message: 'Error al crear la reseña' });
    }
};

// Obtener las reseñas de un producto
export const obtenerReseñasProducto = async (req, res) => {
    const { id } = req.params; // ID del producto

    try {
        const [reseñas] = await pool.query('SELECT * FROM reseñas WHERE producto_id = ?', [id]);

        res.status(200).json(reseñas);
    } catch (error) {
        console.error('Error al obtener las reseñas del producto:', error);
        res.status(500).json({ message: 'Error al obtener las reseñas del producto' });
    }
};

// Obtener las reseñas que ha hecho un usuario
export const obtenerReseñasUsuario = async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const [reseñas] = await pool.query('SELECT * FROM reseñas WHERE usuario_id = ?', [usuario_id]);

        res.status(200).json(reseñas);
    } catch (error) {
        console.error('Error al obtener las reseñas del usuario:', error);
        res.status(500).json({ message: 'Error al obtener las reseñas del usuario' });
    }
};