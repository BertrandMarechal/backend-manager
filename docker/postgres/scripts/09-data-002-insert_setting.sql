INSERT INTO mgtt_setting_set (set_name, set_value)
SELECT 'database extension', 'database' UNION ALL
SELECT 'middle tier extension', 'middle-tier';

INSERT INTO mgtt_setting_set (set_name, set_value,fk_env_set_environment_id)
SELECT 'root password', 
CASE WHEN env_name = 'local' THEN 'route' ELSE NULL END, pk_env_id
FROM mgtt_environment_env;