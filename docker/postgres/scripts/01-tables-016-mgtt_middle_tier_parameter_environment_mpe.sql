create table if not exists mgtt_middle_tier_variable_environment_mve (
    pk_mve_id SERIAL PRIMARY KEY,
    fk_env_mve_environment_id INTEGER NOT NULL REFERENCES mgtt_environment_env(pk_env_id) ON DELETE CASCADE,
    fk_mtv_mve_middle_tier_variable_id INTEGER NOT NULL references mgtt_middle_tier_variable_mtv(pk_mtv_id) ON DELETE CASCADE,
    mve_value TEXT NULL,
    UNIQUE(fk_env_mve_environment_id,fk_mtv_mve_middle_tier_variable_id)
);