create table mgtt_database_version_file_dvf (
    pk_dvf_id SERIAL PRIMARY KEY,
    fk_dbv_dvf_database_version_id INTEGER NOT NULL REFERENCES mgtt_database_version_dbv(pk_dbv_id) ON DELETE CASCADE,
    dvf_file_name TEXT NOT NULL,
    dvf_position INTEGER NOT NULL,
    UNIQUE(fk_dbv_dvf_database_version_id,dvf_file_name),
    UNIQUE(dvf_position, fk_dbv_dvf_database_version_id)
);