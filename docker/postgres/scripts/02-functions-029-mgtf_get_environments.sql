CREATE OR REPLACE FUNCTION mgtf_get_environments()
RETURNS table(
    "environmentName" TEXT
)
STABLE
AS $CODE$
BEGIN
    RETURN QUERY
    SELECT env_name
    from mgtt_environment_env;
END;
$CODE$ LANGUAGE plpgsql