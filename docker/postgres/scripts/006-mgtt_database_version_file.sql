create table mgtt_database_version_file_dbf (
    pk_dbf_id SERIAL PRIMARY KEY,
    fk_dbv_dbf_database_version_id INTEGER NOT NULL REFERENCES mgtt_database_version_dbv(pk_dbv_id),
    dbf_file_name TEXT NOT NULL,
    dbf_position INTEGER NOT NULL,
    UNIQUE(fk_dbv_dbf_database_version_id,dbf_file_name),
    UNIQUE(dbf_position, fk_dbv_dbf_database_version_id)
)