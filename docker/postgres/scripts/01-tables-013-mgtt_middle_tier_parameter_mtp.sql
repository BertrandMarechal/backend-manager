create table if not exists mgtt_middle_tier_parameter_mtp (
    pk_mtp_id SERIAL PRIMARY KEY,
    fk_mtf_mtp_middle_tier_file_id INTEGER NOT NULL references mgtt_middle_tier_file_mtf(pk_mtf_id) ON DELETE CASCADE,
    mtp_parameter_name TEXT NOT NULL,
    mtp_declared BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE(fk_mtf_mtp_middle_tier_file_id,mtp_parameter_name)
);