create table mgtt_database_version_dbv (
    pk_dbv_id SERIAL PRIMARY KEY,
    fk_rep_dbv_repo_id INTEGER REFERENCES mgtt_repository_rep(pk_rep_id),
    dbv_version_id TEXT NOT NULL,
    UNIQUE (fk_rep_dbv_repo_id, dbv_version_id),
    dbv_database_to_user TEXT
);