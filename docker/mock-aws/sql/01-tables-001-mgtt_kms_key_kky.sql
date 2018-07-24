CREATE TABLE mgtt_kms_key_kky (
    pk_kky_id SERIAL PRIMARY KEY,
    kky_name TEXT NOT NULL,
    kky_full_path TEXT UNIQUE,
    kky_value TEXT NULL,
    fk_kky_kky_parent_id INTEGER NULL,
    UNIQUE(fk_kky_kky_parent_id, kky_name)
);