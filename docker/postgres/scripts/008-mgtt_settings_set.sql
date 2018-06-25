create table if not exists mgtt_setting_set (
    pk_set_id SERIAL PRIMARY KEY,
    set_name TEXT UNIQUE NOT NULL,
    set_value TEXT NULL
)