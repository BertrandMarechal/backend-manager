CREATE OR REPLACE FUNCTION mgtf_get_dependencies()
RETURNS INTEGER
VOLATILE
AS $CODE$
BEGIN
        TRUNCATE TABLE mgtt_database_version_dependencies_dvd;

        INSERT INTO mgtt_database_version_dependencies_dvd (fk_dbv_dvd_version_id,fk_dbv_dvd_depends_on_version_id)
        select b.pk_dbv_id, dbv_to.pk_dbv_id
        FROM (
                select pk_dbv_id, dbv_dependencies, obj->>'application' || '-' || set_value "repo_name", obj->>'version' "version"
                FROM (
                        select pk_dbv_id, dbv_dependencies,  json_array_elements(dbv_dependencies) obj
                        from mgtt_database_version_dbv dbv_from
                ) a
                INNER JOIN mgtt_setting_set ON set_name = 'database extension'
        ) b
        INNER JOIN mgtt_repository_rep ON rep_folder_name = repo_name
        INNER JOIN mgtt_database_version_dbv dbv_to
                ON dbv_to.fk_rep_dbv_repo_id = pk_rep_id
                AND dbv_to.pk_dbv_id != b.pk_dbv_id
                AND dbv_to.dbv_version_id = version
                ON CONFLICT(fk_dbv_dvd_version_id,fk_dbv_dvd_depends_on_version_id) DO NOTHING;
    RETURN 1;
END;
$CODE$ LANGUAGE plpgsql