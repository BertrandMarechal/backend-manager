create table if not exists mgtt_setting_set (
    pk_set_id SERIAL PRIMARY KEY,    
    fk_env_set_environment_id INTEGER NULL REFERENCES mgtt_environment_env(pk_env_id) ON DELETE CASCADE,
    set_name TEXT NOT NULL,
    set_value TEXT NULL,
    UNIQUE(set_name, fk_env_set_environment_id)
)