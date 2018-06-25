CREATE OR REPLACE FUNCTION mgtf_update_repo_folders (i_repo_folder_list TEXT[])
    RETURNS TABLE (
        "name" TEXT,
        "isDatabase" BOOLEAN,
        "isMiddleTier" BOOLEAN
    )
    VOLATILE
AS $CODE$
BEGIN
    --DELETE OLD REPOS VERSIONS DEPENDENCIES
    DELETE FROM mgtt_database_version_dependencies_dvd
    WHERE fk_dbv_dvd_version_id IN (
        SELECT pk_dbv_id
        FROM mgtt_database_version_dbv
        WHERE fk_rep_dbv_repo_id NOT IN (
            SELECT pk_rep_id
            FROM mgtt_repository_rep
            WHERE rep_folder_name NOT IN (
                SELECT split_part(unnest.unnest, '/', 4) as repo_name
                FROM unnest(i_repo_folder_list)
            )   
        )
    )
    OR fk_dbv_dvd_depends_on_version_id IN (
        SELECT pk_dbv_id
        FROM mgtt_database_version_dbv
        WHERE fk_rep_dbv_repo_id NOT IN (
            SELECT pk_rep_id
            FROM mgtt_repository_rep
            WHERE rep_folder_name NOT IN (
                SELECT split_part(unnest.unnest, '/', 4) as repo_name
                FROM unnest(i_repo_folder_list)
            )   
        )
    );

    --DELETE OLD REPOS VERSIONS FILES
    DELETE FROM mgtt_database_version_file_dbf
    WHERE fk_dbv_dbf_database_version_id IN (
        SELECT pk_dbv_id
        FROM mgtt_database_version_dbv
        WHERE fk_rep_dbv_repo_id NOT IN (
            SELECT pk_rep_id
            FROM mgtt_repository_rep
            WHERE rep_folder_name NOT IN (
                SELECT split_part(unnest.unnest, '/', 4) as repo_name
                FROM unnest(i_repo_folder_list)
            )   
        )
    );
    
    --DELETE OLD REPOS VERSIONS
    DELETE FROM mgtt_database_version_dbv
    WHERE fk_rep_dbv_repo_id NOT IN (
        SELECT pk_rep_id
        FROM mgtt_repository_rep
        WHERE rep_folder_name NOT IN (
            SELECT split_part(unnest.unnest, '/', 4) as repo_name
            FROM unnest(i_repo_folder_list)
        )   
    );    
    
    --DELETE OLD REPOS PARAMETERS
    DELETE FROM mgtt_database_version_dbv
    WHERE fk_rep_dbv_repo_id NOT IN (
        SELECT pk_rep_id
        FROM mgtt_repository_rep
        WHERE rep_folder_name NOT IN (
            SELECT split_part(unnest.unnest, '/', 4) as repo_name
            FROM unnest(i_repo_folder_list)
        )   
    );

    --DELETE THE OLD REPOS
    DELETE FROM mgtt_repository_rep
    WHERE rep_folder_name NOT IN (
        SELECT split_part(unnest.unnest, '/', 4) as repo_name
        FROM unnest(i_repo_folder_list)
    );

    --CREATE THE MISSING ONES
    INSERT INTO mgtt_repository_rep (rep_folder_name)
    SELECT split_part(unnest.unnest, '/', 4) as repo_name
    FROM unnest(i_repo_folder_list)
    ON CONFLICT(rep_folder_name) DO NOTHING;

    --SETTING THE IS_DATABASE OR IS_SERVERLESS
    UPDATE mgtt_repository_rep
    SET rep_is_database = rep_folder_name LIKE (
        SELECT '%' || set_value FROM mgtt_setting_set WHERE set_name = 'database extension'
    ),
    rep_is_middle_tier = rep_folder_name LIKE (
        SELECT '%' || set_value FROM mgtt_setting_set WHERE set_name = 'middle tier extension'
    );

    --UPDATE REPO ID ON dbf
    UPDATE mgtt_database_files_dfb
    SET fk_rep_dfb_repo_id = (
        SELECT pk_rep_id
        FROM mgtt_repository_rep
        WHERE split_part(dfb_file_path, '/', 4) = rep_folder_name
    );
    RETURN QUERY
    SELECT * FROM mgtf_get_repositories();
END;
$CODE$ LANGUAGE plpgsql