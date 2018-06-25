create table if not exists mgtt_database_files_dfb (
    pk_dbf_id serial primary key,
    dfb_file_path TEXT NOT NULL,
    fk_rep_dfb_repo_id INTEGER NULL REFERENCES mgtt_repository_rep(pk_rep_id),
    UNIQUE(dfb_file_path, fk_rep_dfb_repo_id),
    fk_dbv_dfb_database_version_id INTEGER NULL REFERENCES mgtt_database_version_dbv(pk_dbv_id)
);