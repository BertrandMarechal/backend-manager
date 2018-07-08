create table if not exists mgtt_repository_rep (
    pk_rep_id SERIAL PRIMARY KEY,
    rep_folder_name TEXT UNIQUE NOT NULL,
    rep_is_database BOOLEAN NOT NULL DEFAULT FALSE,
    rep_is_middle_tier BOOLEAN NOT NULL DEFAULT FALSE    
);