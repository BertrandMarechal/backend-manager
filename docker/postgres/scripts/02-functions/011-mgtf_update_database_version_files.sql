CREATE OR REPLACE FUNCTION mgtf_update_database_version_files(i_repo_name TEXT, i_files json DEFAULT null
)
RETURNS INTEGER
VOLATILE
AS $CODE$
BEGIN
    DELETE FROM mgtt_database_file_dbf
    WHERE fk_rep_dbf_repo_id IN (
        select pk_rep_id
        FROM mgtt_repository_rep
        WHERE rep_folder_name = i_repo_name
    );

    --INSERT THE MISSING VERSIONS
    with raw_data as (
        SELECT DISTINCT
            i_repo_name as repo_name,
            t."fileName" file_name
        FROM json_to_recordset(i_files) t("fileName" TEXT, version json)
    ), insert_database_files AS (
            INSERT INTO mgtt_database_file_dbf(dbf_file_path, fk_rep_dbf_repo_id)
            SELECT file_name, pk_rep_id
            FROM raw_data
            INNER JOIN mgtt_repository_rep
                ON rep_folder_name = repo_name
            RETURNING pk_dbf_id, dbf_file_path, fk_rep_dbf_repo_id
    )
    INSERT INTO mgtt_database_version_dbv
        (fk_rep_dbv_repo_id, dbv_version_id, dbv_database_user_to_use,fk_dbf_dbv_database_file_id)
    SELECT
        pk_rep_id,
        split_part(t."fileName", '/', 4) as version_id,
        (t.version->>'userToUse')::TEXT,
        insert_database_files.pk_dbf_id
    FROM json_to_recordset(i_files) t ("fileName" TEXT, version json)
    INNER JOIN mgtt_repository_rep ON rep_folder_name = i_repo_name
    INNER JOIN insert_database_files
        ON fk_rep_dbf_repo_id = pk_rep_id
        AND t."fileName" like dbf_file_path || '%'
    ON CONFLICT(fk_rep_dbv_repo_id, dbv_version_id, dbv_database_user_to_use) DO NOTHING;

    --INSERT IN THE mgtt_database_version_file_dvf table
    
    with raw_data as (
        SELECT
            i_repo_name as repo_name,
            split_part(t."fileName", '/', 4) as version_id,
            version->>'userToUse' as user_to_use,
            version->>'dependencies' as dependencies,
            version->>'fileList' as file_list
        FROM json_to_recordset(i_files) t("fileName" TEXT, version json)
    ), ready_to_insert_data as (
        SELECT
            repo_name,
            version_id,
            pk_dbv_id,
            user_to_use,
            dependencies,
            REPLACE(json_array_elements(file_list::json)::TEXT,'"','') as sql_file_name,
            row_number() OVER (PARTITION BY repo_name,version_id, user_to_use ORDER BY REPLACE(json_array_elements(file_list::json)::TEXT,'"','')) AS position
        from raw_data
        inner join mgtt_database_version_dbv ON dbv_version_id = version_id AND dbv_database_user_to_use = user_to_use
        INNER JOIN mgtt_repository_rep
            ON fk_rep_dbv_repo_id = pk_rep_id
            AND rep_folder_name = repo_name
    ), insert_in_dvf AS (
        INSERT INTO mgtt_database_version_file_dvf
        (fk_dbv_dvf_database_version_id, dvf_file_name, dvf_position)
        SELECT pk_dbv_id, sql_file_name, position
        FROM ready_to_insert_data
    )
    INSERT INTO mgtt_database_version_dependencies_dvd
    (fk_dbv_dvd_version_id,fk_dbv_dvd_depends_on_version_id)
    
    SELECT DISTINCT dbv_from.pk_dbv_id, dbv_to.pk_dbv_id
    FROM (
            select repo_name, version_id,json_array_elements(dependencies::json)->>'application' application_dependency,json_array_elements(dependencies::json)->>'version' version_dependency
            from ready_to_insert_data
    )a
    inner join mgtt_database_version_dbv dbv_from ON dbv_from.dbv_version_id = version_id
    INNER JOIN mgtt_repository_rep rep_from
            ON dbv_from.fk_rep_dbv_repo_id = rep_from.pk_rep_id
            AND rep_from.rep_folder_name = repo_name
    inner join mgtt_database_version_dbv dbv_to ON dbv_to.dbv_version_id = version_dependency
    INNER JOIN mgtt_setting_set ON set_name = 'database extension'
    INNER JOIN mgtt_repository_rep rep_to
            ON dbv_to.fk_rep_dbv_repo_id = rep_to.pk_rep_id
            AND rep_to.rep_folder_name = application_dependency || '-' || set_value
    ON CONFLICT(fk_dbv_dvd_version_id,fk_dbv_dvd_depends_on_version_id) DO NOTHING;
    RETURN 1;
END;
$CODE$ LANGUAGE plpgsql