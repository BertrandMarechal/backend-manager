create table if not exists mgtt_middle_tier_function_mlf (
    pk_mlf_id SERIAL PRIMARY KEY,
    fk_mtf_mlf_middle_tier_file_id INTEGER NOT NULL references mgtt_middle_tier_file_mtf(pk_mtf_id)  ON DELETE CASCADE,
    mlf_name TEXT NOT NULL,
    mlf_file_name TEXT NOT NULL,
    mlf_handler_name TEXT NOT NULL,
    UNIQUE(fk_mtf_mlf_middle_tier_file_id,mlf_file_name)
);