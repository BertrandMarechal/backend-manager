create or replace function mgtf_replace_parameter_variables(i_parameter_id INTEGER, i_environment TEXT) RETURNS TEXT
STABLE
AS $CODE$
DECLARE
        v_text TEXT := '';
        v_var_name TEXT := '';
        v_mtf_id INTEGER;
BEGIN
        SELECT mtp_parameter_value, fk_mtf_mtp_middle_tier_file_id
        INTO v_text, v_mtf_id
        FROM mgtt_middle_tier_parameter_mtp
        WHERE pk_mtp_id = i_parameter_id;
        
        
        FOR v_var_name IN
                select (regexp_matches(v_text,'<(.*?)>', 'g'))[1]
        LOOP
                v_text = (SELECT regexp_replace(v_text, '<(' || v_var_name || ')>',COALESCE((
                        select mve_value::TEXT
                        from mgtt_middle_tier_variable_environment_mve
                        INNER JOIN mgtt_environment_env
                                on env_name = i_environment
                                AND fk_env_mve_environment_id = pk_env_id
                        INNER JOIN mgtt_middle_tier_variable_mtv
                                on fk_mtv_mve_middle_tier_variable_id = pk_mtv_id
                                AND fk_mtf_mtv_middle_tier_file_id = v_mtf_id
                                AND mtv_variable_name = v_var_name
                ),v_var_name)));
        END LOOP;
        RETURN v_text;
END;
$CODE$ language plpgsql