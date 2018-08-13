create table if not exists mgtt_middle_tier_variable_mtv (
    pk_mtv_id SERIAL PRIMARY KEY,
    fk_mtf_mtv_middle_tier_file_id INTEGER NOT NULL references mgtt_middle_tier_file_mtf(pk_mtf_id) ON DELETE CASCADE,
    mtv_variable_name TEXT NOT NULL,
    mtv_declared BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(fk_mtf_mtv_middle_tier_file_id,mtv_variable_name)
);