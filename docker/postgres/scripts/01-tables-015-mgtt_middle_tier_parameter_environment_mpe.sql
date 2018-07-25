create table if not exists mgtt_middle_tier_parameter_environment_mpe (
    pk_mpe_id SERIAL PRIMARY KEY,
    fk_env_mpe_environment_id INTEGER NOT NULL REFERENCES mgtt_environment_env(pk_env_id) ON DELETE CASCADE,
    fk_mtp_mpe_middle_tier_parameter_id INTEGER NOT NULL references mgtt_middle_tier_parameter_mtp(pk_mtp_id) ON DELETE CASCADE,
    mpe_value TEXT NULL,
    UNIQUE(fk_env_mpe_environment_id,fk_mtp_mpe_middle_tier_parameter_id)
);