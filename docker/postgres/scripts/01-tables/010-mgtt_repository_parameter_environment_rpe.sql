create table if not exists mgtt_database_parameter_environment_dpe (
    pk_dpe_id SERIAL PRIMARY KEY,
    fk_env_dpe_environment_id INTEGER NOT NULL REFERENCES mgtt_environment_env(pk_env_id) ON DELETE CASCADE,
    fk_dpa_dpe_database_parameter_id INTEGER NOT NULL references mgtt_database_parameter_dpa(pk_dpa_id) ON DELETE CASCADE,
    dpe_value TEXT NOT NULL,
    UNIQUE(fk_env_dpe_environment_id,fk_dpa_dpe_database_parameter_id)
)