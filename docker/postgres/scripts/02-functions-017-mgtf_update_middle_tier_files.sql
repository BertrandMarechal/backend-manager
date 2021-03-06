CREATE OR REPLACE FUNCTION mgtf_update_middle_tier_files(i_repo_name TEXT, i_parent_folder TEXT, i_serverless_file json, i_serverless_variables json, i_variables_variables json)
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
                    i_serverless_variables environmentVariables,
                    ((i_serverless_file->>'functions')::json) as functions
            FROM mgtt_repository_rep
            LEFT JOIN mgtt_middle_tier_file_mtf
                    ON fk_rep_mtf_repository_id = pk_rep_id
                    AND mtf_service_name = (i_serverless_file->>'serviceName')::TEXT
            WHERE rep_folder_name = i_repo_name
    ), delete_middle_tier_file as (
            -- delete the existing file
            delete from mgtt_middle_tier_file_mtf
            where pk_mtf_id = (
                    select pk_mtf_id
                    from file_data
            ) returning pk_mtf_id
    ), insert_data_file AS (
            -- insert the new file
            INSERT INTO mgtt_middle_tier_file_mtf (fk_rep_mtf_repository_id,mtf_file_name,mtf_service_name)
            SELECT pk_rep_id, i_parent_folder, service_name
            FROM file_data
            LEFT JOIN delete_middle_tier_file ON TRUE
            returning pk_mtf_id
    ), insert_functions AS (
            -- insert the functions
        INSERT INTO mgtt_middle_tier_function_mlf (
                fk_mtf_mlf_middle_tier_file_id,
                mlf_name,
                mlf_file_name,
                mlf_handler_name
        )
        SELECT pk_mtf_id, (func::json)->>'name', (func::json)->>'handler', (func::json)->>'handlerFunctionName'
        FROM insert_data_file
        INNER JOIN (
                SELECT json_array_elements(functions) as func
                FROM file_data
        ) a ON TRUE
        RETURNING pk_mlf_id, mlf_name
    ), function_data AS (
            -- get function data ready for event insert
            SELECT pk_mlf_id, mlf_name
            FROM (
                    SELECT json_array_elements(functions) as func
                    FROM file_data
            ) a
            INNER JOIN file_data on TRUE
            INNER JOIN insert_functions
                    ON mlf_name = (func::json)->>'name'
            LEFT JOIN insert_data_file ON TRUE
    ), insert_events AS (
            -- insert events
            INSERT INTO mgtt_lambda_function_event_lfe (fk_mlf_lfe_middle_tier_function_id, lfe_event_type, lfe_parameters)
            SELECT pk_mlf_id, (eve::json)->>'type', ((eve::json)->>'params')::json
            FROM (
                    select (func::json)->>'name' "name", json_array_elements(((func::json)->>'events')::json) eve
                    from (
                            SELECT json_array_elements(functions) as func
                            FROM file_data
                    ) a
            ) b
            INNER JOIN function_data ON mlf_name = b."name"
        ), insert_variables as (
                INSERT INTO mgtt_middle_tier_variable_mtv (fk_mtf_mtv_middle_tier_file_id, mtv_variable_name, mtv_declared)
                SELECT pk_mtf_id, v_variables.variables_values->>'key', (v_variables.variables_values->>'declared')::boolean
                FROM insert_data_file
                LEFT JOIN (
                        SELECT json_array_elements(i_variables_variables) as variables_values
                ) v_variables ON true
                WHERE v_variables.variables_values->>'key' is not null
                returning pk_mtv_id, mtv_variable_name
        ), insert_variable_env as (
                INSERT INTO mgtt_middle_tier_variable_environment_mve (
                        fk_env_mve_environment_id,
                        fk_mtv_mve_middle_tier_variable_id,
                        mve_value
                )
                SELECT pk_env_id, pk_mtv_id, v_variables.variables_values->>'value'
                FROM insert_variables
                INNER JOIN mgtt_environment_env ON env_name = 'dev'
                LEFT JOIN (
                        SELECT json_array_elements(i_variables_variables) as variables_values
                ) v_variables ON v_variables.variables_values->>'key' = mtv_variable_name
                AND v_variables.variables_values->>'value' IS NOT NULL
                RETURNING pk_mve_id
        ), insert_params AS (
                INSERT INTO mgtt_middle_tier_parameter_mtp(
                        fk_mtf_mtp_middle_tier_file_id,
                        mtp_parameter_name,
                        mtp_parameter_value
                )
                SELECT pk_mtf_id,t."key", t."value"
                FROM json_to_recordset(i_serverless_variables) t("key" TEXT, "value" TEXT)
                INNER JOIN insert_data_file ON TRUE
                RETURNING pk_mtp_id
        )
        -- update the stages for each env
        INSERT INTO mgtt_middle_tier_variable_environment_mve (
                fk_env_mve_environment_id,
                fk_mtv_mve_middle_tier_variable_id,
                mve_value
        )
        SELECT pk_env_id, pk_mtv_id,env_name
        FROM mgtt_environment_env
        INNER JOIN insert_data_file ON true
        INNER JOIN insert_variable_env ON true
        LEFT JOIN insert_variables ON mtv_variable_name = 'stage'
        -- INNER JOIN mgtt_middle_tier_parameter_mtp
        --         ON insert_data_file.pk_mtf_id = fk_mtf_mtp_middle_tier_file_id
        --         AND
        WHERE pk_mtv_id is not null
        ON CONFLICT(fk_env_mve_environment_id,fk_mtv_mve_middle_tier_variable_id) DO NOTHING;

    RETURN 1;
END;
$CODE$ LANGUAGE plpgsql