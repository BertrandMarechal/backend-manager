DROP FUNCTION IF EXISTS mgtf_update_middle_tier_files(TEXT,TEXT,json,json);
CREATE OR REPLACE FUNCTION mgtf_update_middle_tier_files(
    i_repo_name TEXT,
    i_parent_folder TEXT,
    i_serverless_file json,
    i_variables_file json default null)
RETURNS INTEGER
VOLATILE
AS $CODE$
BEGIN    
    WITH file_data AS (
            SELECT
                    pk_rep_id,
                    pk_mtf_id,
                    rep_folder_name,
                    (i_serverless_file->>'serviceName')::TEXT service_name,
                    ((i_serverless_file->>'environmentVariables')::json) environmentVariables,
                    ((i_serverless_file->>'functions')::json) as functions
            FROM mgtt_repository_rep
            LEFT JOIN mgtt_middle_tier_file_mtf
                    ON fk_rep_mtf_repository_id = pk_rep_id
                    AND mtf_service_name = (i_serverless_file->>'serviceName')::TEXT
            WHERE rep_folder_name = i_repo_name
    ), delete_middle_tier_file as (
            delete from mgtt_middle_tier_file_mtf
            where pk_mtf_id = (
                    select pk_mtf_id
                    from file_data
            ) returning pk_mtf_id
    ), insert_data_file AS (
            INSERT INTO mgtt_middle_tier_file_mtf (fk_rep_mtf_repository_id,mtf_file_name,mtf_service_name)
            SELECT pk_rep_id, i_parent_folder, service_name
            FROM file_data
            LEFT JOIN delete_middle_tier_file ON TRUE
            returning pk_mtf_id
    ), function_data AS (
            SELECT pk_mlf_id, mlf_name
            FROM (
                    SELECT json_array_elements(functions) as func
                    FROM file_data
            ) a
            INNER JOIN file_data on TRUE
            INNER JOIN mgtt_middle_tier_function_mlf
                    ON fk_mtf_mlf_middle_tier_file_id = pk_mtf_id
                    AND mlf_name = (func::json)->>'name'
            LEFT JOIN insert_data_file ON TRUE
    ), insert_events AS (
            INSERT INTO mgtt_lambda_function_event_lfe (fk_mlf_lfe_middle_tier_function_id, lfe_event_type, lfe_parameters)
            SELECT pk_mlf_id, (eve::json)->>'type', ((eve::json)->>'params')::json
            FROM (
                    select (func::json)->>'name' "name", json_array_elements(((func::json)->>'events')::json) eve--json_array_elements((func::json)->>'events'::json)
                    from (
                            SELECT json_array_elements(functions) as func
                            FROM file_data
                    ) a
            ) b
            INNER JOIN function_data ON mlf_name = b."name"
        )
    INSERT INTO mgtt_middle_tier_parameter_mtp (fk_mtf_mtp_middle_tier_file_id, mtp_parameter_name, mtp_parameter_value)
    SELECT pk_mtf_id, s_variables.var, v_variables.variables_values->>'value'
    FROM insert_data_file
    INNER JOIN (
            SELECT REPLACE(json_array_elements(environmentVariables)::TEXT,'"','') as var
            FROM file_data
    ) s_variables ON TRUE
    LEFT JOIN (
            SELECT json_array_elements(i_variables_file) as variables_values
    ) v_variables ON v_variables.variables_values->>'key' = s_variables.var;

    RETURN 1;
END;
$CODE$ LANGUAGE plpgsql