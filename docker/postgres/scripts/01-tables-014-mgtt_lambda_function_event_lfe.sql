create table if not exists mgtt_lambda_function_event_lfe (
    pk_lfe_id SERIAL PRIMARY KEY,
    fk_mlf_lfe_middle_tier_function_id INTEGER NOT NULL references mgtt_middle_tier_function_mlf(pk_mlf_id) ON DELETE CASCADE,
    lfe_event_type TEXT NOT NULL,
    lfe_parameters JSON NOT NULL
);