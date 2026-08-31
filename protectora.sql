1. CREACIÓN DE TIPOS ENUM (Definición de dominios)
CREATE TYPE dog_gender AS ENUM ('Male', 'Female');
CREATE TYPE dog_size AS ENUM ('Small', 'Medium', 'Large');
CREATE TYPE compatibility_tri_state AS ENUM ('Yes', 'No', 'Unknown');
CREATE TYPE dog_compatibility_options AS ENUM ('Yes', 'No', 'Only Females', 'Only Males', 'Selective');
CREATE TYPE activity_level_options AS ENUM ('Low', 'Medium', 'High', 'Very High');
CREATE TYPE adoption_status AS ENUM ('Available for Adoption', 'Foster Care', 'Adopted');

-- 2. CREACIÓN DE LA SECUENCIA
CREATE SEQUENCE dogs_internal_id_seq START WITH 1;

-- 3. CREACIÓN DE LA TABLA
CREATE TABLE dogs (
    internal_id INT PRIMARY KEY DEFAULT nextval('dogs_internal_id_seq'),
    id TEXT GENERATED ALWAYS AS ('DOG-' || LPAD(internal_id::text, 5, '0')) STORED,
    name TEXT NOT NULL,
    gender dog_gender NOT NULL,
    
    size dog_size NOT NULL,
    cat_compatible compatibility_tri_state NOT NULL DEFAULT 'Unknown',
    dog_compatible dog_compatibility_options NOT NULL,
    child_compatible compatibility_tri_state NOT NULL DEFAULT 'Unknown',
    activity_level activity_level_options NOT NULL,
    
    birth_date DATE NULL,
    intake_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status adoption_status NOT NULL DEFAULT 'Available for Adoption',
    medical_needs TEXT NULL,
    photo_url TEXT NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 4. SEGURIDAD: ACTIVAR ROW LEVEL SECURITY (RLS)
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICA 1: Permitir lectura pública (Cualquiera puede ver los perros)
CREATE POLICY "Permitir lectura publica de perros" 
ON dogs 
FOR SELECT 
USING (true);

-- 6. POLÍTICA 2: Permitir inserción/modificación total solo al rol de servicio (Make.com / Backend privado)
CREATE POLICY "Permitir gestion completa al service_role" 
ON dogs 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);