INSERT INTO mgtt_environment_env (env_name)
SELECT 'local' UNION ALL
SELECT 'dev' UNION ALL
SELECT 'demo' UNION ALL
SELECT 'prod';