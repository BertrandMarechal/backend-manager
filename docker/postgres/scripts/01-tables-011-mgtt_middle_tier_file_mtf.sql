create table if not exists mgtt_middle_tier_file_mtf (
    pk_mtf_id SERIAL PRIMARY KEY,
    fk_rep_mtf_repository_id INTEGER NOT NULL references mgtt_repository_rep(pk_rep_id) ON DELETE CASCADE,
    mtf_file_name TEXT NOT NULL,
    mtf_service_name TEXT NOT NULL,
    UNIQUE(fk_rep_mtf_repository_id,mtf_file_name)
);