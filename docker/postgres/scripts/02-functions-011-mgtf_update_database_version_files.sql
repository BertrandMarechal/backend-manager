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
    (
        fk_rep_dbv_repo_id,
        dbv_version_id,
        dbv_user_to_use,
        dbv_database_to_use,
        fk_dbf_dbv_database_file_id,
        dbv_dependencies
    )
    SELECT
        pk_rep_id,
        split_part(t."fileName", '/', 4) as version_id,
        COALESCE(t.version->>'userToUse', 'root'),
        COALESCE((t.version->>'databaseToUse')::TEXT,'application database'),
        insert_database_files.pk_dbf_id,
        (t.version->>'dependencies')::json
    FROM json_to_recordset(i_files) t ("fileName" TEXT, version json)
    INNER JOIN mgtt_repository_rep ON rep_folder_name = i_repo_name
    INNER JOIN insert_database_files
        ON fk_rep_dbf_repo_id = pk_rep_id
        AND t."fileName" like dbf_file_path || '%'
    ON CONFLICT(fk_rep_dbv_repo_id, dbv_version_id, dbv_database_to_use) DO NOTHING;

    --INSERT IN THE mgtt_database_version_file_dvf table
    
    with raw_data as (
        SELECT
            i_repo_name as repo_name,
            split_part(t."fileName", '/', 4) as version_id,
            COALESCE(version->>'databaseToUse','application database') as database_to_use,
            COALESCE(version->>'userToUse', 'root') as user_to_use,
            version->>'dependencies' as dependencies,
            version->>'fileList' as file_list
        FROM json_to_recordset(i_files) t("fileName" TEXT, version json)
    ), ready_to_insert_data as (
        select *,
        row_number() OVER (PARTITION BY repo_name,version_id, user_to_use, database_to_use ORDER BY position_1) AS "position"
        from  (
                select *,
                row_number() OVER () AS "position_1"
                from (
                    SELECT
                        repo_name,
                        version_id,
                        pk_dbv_id,
                        user_to_use,
                        database_to_use,
                        dependencies,
                        REPLACE(json_array_elements(file_list::json)::TEXT,'"','') as sql_file_name
                    from raw_data
                    inner join mgtt_database_version_dbv
                        ON dbv_version_id = version_id
                        AND COALESCE(dbv_database_to_use,'application database') = database_to_use
                        AND dbv_user_to_use = user_to_use
                    INNER JOIN mgtt_repository_rep
                        ON fk_rep_dbv_repo_id = pk_rep_id
                        AND rep_folder_name = repo_name
                ) a
        ) b
    )
    INSERT INTO mgtt_database_version_file_dvf (fk_dbv_dvf_database_version_id, dvf_file_name, dvf_position)
    SELECT pk_dbv_id, sql_file_name, position
    FROM ready_to_insert_data;

    PERFORM mgtf_get_dependencies();
    RETURN 1;
END;
$CODE$ LANGUAGE plpgsql