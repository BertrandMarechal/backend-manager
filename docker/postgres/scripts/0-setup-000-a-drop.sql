DO
$body$
DECLARE
    v_cur_functions CURSOR(dummy TEXT)
    FOR SELECT 'DROP FUNCTION ' || ns.nspname || '.' || proname 
       || '(' || oidvectortypes(proargtypes) || ');'
    FROM pg_proc INNER JOIN pg_namespace ns ON (pg_proc.pronamespace = ns.oid)
    WHERE ns.nspname = 'public'  order by proname;

    v_rec_cur_function TEXT := '';
BEGIN

    OPEN v_cur_functions(null);
    LOOP
        FETCH v_cur_functions INTO v_rec_cur_function;
        EXIT WHEN NOT FOUND;
        EXECUTE v_rec_cur_function;
    END LOOP;
    CLOSE v_cur_functions;
end
$body$
;

DROP TABLE IF EXISTS mgtt_middle_tier_parameter_environment_mpe;
DROP TABLE IF EXISTS mgtt_lambda_function_event_lfe;
DROP TABLE IF EXISTS mgtt_middle_tier_parameter_mtp;
DROP TABLE IF EXISTS mgtt_middle_tier_function_mlf;
DROP TABLE IF EXISTS mgtt_middle_tier_file_mtf;
DROP TABLE IF EXISTS mgtt_database_parameter_environment_dpe;
DROP TABLE IF EXISTS mgtt_database_parameter_dpa;
DROP TABLE IF EXISTS mgtt_database_version_file_dvf;
DROP TABLE IF EXISTS mgtt_database_version_dependencies_dvd;
DROP TABLE IF EXISTS mgtt_database_version_dbv;
DROP TABLE IF EXISTS mgtt_database_file_dbf;
DROP TABLE IF EXISTS mgtt_setting_set;
DROP TABLE IF EXISTS mgtt_environment_env;
DROP TABLE IF EXISTS mgtt_repository_rep;