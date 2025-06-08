-- Script para agregar la columna role a la tabla users
-- Ejecutar este script en la base de datos

-- Verificar si la columna ya existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'role'
    ) THEN
        -- Agregar la columna role con valor por defecto 'ADMIN'
        ALTER TABLE users
        ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'ADMIN';
        
        -- Agregar comentario a la columna
        COMMENT ON COLUMN users.role IS 'Rol del usuario: ADMIN o READ_ONLY';
        
        RAISE NOTICE 'Columna role agregada exitosamente a la tabla users';
    ELSE
        RAISE NOTICE 'La columna role ya existe en la tabla users';
    END IF;
END $$;
