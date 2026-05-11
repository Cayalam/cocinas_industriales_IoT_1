-- Database: prototipo_cocina_iot

-- DROP DATABASE IF EXISTS prototipo_cocina_iot;

CREATE DATABASE prototipo_cocina_iot
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Latin America.1252'
    LC_CTYPE = 'Spanish_Latin America.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
	CREATE TABLE lecturas_sensores (
    id SERIAL PRIMARY KEY,

    temperatura DECIMAL(5,2),
    nivel_gas INTEGER,
    llama_detectada BOOLEAN,

    ventilador_extraccion BOOLEAN,
    ventilador_inyeccion_1 BOOLEAN,
    ventilador_inyeccion_2 BOOLEAN,

    estado_sistema VARCHAR(30),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);