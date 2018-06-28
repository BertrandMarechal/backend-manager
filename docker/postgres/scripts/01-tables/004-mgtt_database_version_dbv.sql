create table mgtt_database_version_dbv (
    pk_dbv_id SERIAL PRIMARY KEY,
    fk_rep_dbv_repo_id INTEGER REFERENCES mgtt_repository_rep(pk_rep_id) ON DELETE CASCADE,
    fk_dbf_dbv_database_file_id INTEGER NULL REFERENCES mgtt_database_file_dbf(pk_dbf_id) ON DELETE CASCADE,
    dbv_version_id TEXT NOT NULL,
    dbv_database_user_to_use TEXT NOT NULL DEFAULT 'root'::TEXT,
    UNIQUE(fk_rep_dbv_repo_id, dbv_version_id, dbv_database_user_to_use)
);