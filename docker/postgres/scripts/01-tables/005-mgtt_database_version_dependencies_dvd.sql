create table mgtt_database_version_dependencies_dvd (
    pk_dvd_id SERIAL PRIMARY KEY,
    fk_dbv_dvd_version_id INTEGER NOT NULL REFERENCES mgtt_database_version_dbv(pk_dbv_id) ON DELETE CASCADE,
    fk_dbv_dvd_depends_on_version_id INTEGER NOT NULL REFERENCES mgtt_database_version_dbv(pk_dbv_id) ON DELETE CASCADE,
    UNIQUE(fk_dbv_dvd_version_id,fk_dbv_dvd_depends_on_version_id)
);