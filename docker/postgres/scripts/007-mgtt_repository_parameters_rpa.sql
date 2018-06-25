create table if not exists mgtt_repository_parameter_rpa (
    pk_rpa_id SERIAL PRIMARY KEY,
    rpa_name TEXT UNIQUE NOT NULL,
    rpa_value TEXT NULL
)