create table if not exists mgtt_database_parameter_dpa (
    pk_dpa_id SERIAL PRIMARY KEY,
    fk_rep_dpa_repository_id INTEGER NOT NULL references mgtt_repository_rep(pk_rep_id) ON DELETE CASCADE,
    dpa_name TEXT NOT NULL,
    UNIQUE(dpa_name, fk_rep_dpa_repository_id)
)