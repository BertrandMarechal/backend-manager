create table if not exists mgtt_database_file_dbf (
    pk_dbf_id serial primary key,
    dbf_file_path TEXT NOT NULL,
    fk_rep_dbf_repo_id INTEGER NULL REFERENCES mgtt_repository_rep(pk_rep_id) ON DELETE CASCADE,
    UNIQUE(dbf_file_path, fk_rep_dbf_repo_id)
);