CREATE OR REPLACE FUNCTION mgtf_get_installation_tree(
        i_repo_name TEXT,
        i_version TEXT,
        i_user TEXT,
        i_file_name TEXT)
RETURNS TABLE (
        "repoName" TEXT,
        "version" TEXT,
        "user" TEXT,
        "files" json
)
VOLATILE
AS $CODE$
DECLARE
        v_todo integer := 1;
        v_iterator integer := -1;
BEGIN
        drop table IF EXISTS temp_database_scripts;
        CREATE TEMP TABLE temp_database_scripts (
                rep_folder_name TEXT,
                pk_dbv_id INTEGER,
                dbv_version_id TEXT,
                dbv_database_user_to_use TEXT,
                depending INTEGER,
                depending_version_id TEXT,
                depending_database_user_to_use TEXT,
                dvf_file_name TEXT,
                dvf_position INTEGER,
                db_position INTEGER,
                dependency_position INTEGER)
        ON COMMIT DROP;
        WITH
                raw_data
                AS
                (

                        select
                                --pk_rep_id,
                                rep_folder_name,
                                --rep_is_database,
                                --pk_dbf_id,
                                --dbf_file_path,
                                --fk_rep_dbf_repo_id,
                                --pk_dbv_id,
                                --fk_rep_dbv_repo_id,
                                --fk_dbf_dbv_database_file_id,
                                dbv.pk_dbv_id,
                                dbv.dbv_version_id,
                                dbv.dbv_database_user_to_use,
                                dbv_depending_on.pk_dbv_id as depending,
                                dbv_depending_on.dbv_version_id as depending_version_id,
                                dbv_depending_on.dbv_database_user_to_use as depending_database_user_to_use,

                                --pk_dvd_id,
                                --fk_dbv_dvd_version_id,
                                --fk_dbv_dvd_depends_on_version_id,

                                --pk_dvf_id,
                                --fk_dbv_dvf_database_version_id,
                                dvf_file_name,
                                dvf_position
                        FROM mgtt_database_version_file_dvf
                        LEFT JOIN mgtt_database_version_dbv dbv ON fk_dbv_dvf_database_version_id = dbv.pk_dbv_id
                        LEFT JOIN mgtt_database_version_dependencies_dvd
                                ON fk_dbv_dvd_version_id = dbv.pk_dbv_id
                        LEFT JOIN mgtt_database_version_dbv dbv_depending_on
                                ON dbv_depending_on.pk_dbv_id = fk_dbv_dvd_depends_on_version_id
                        LEFT JOIN mgtt_database_file_dbf ON dbv.fk_dbf_dbv_database_file_id = pk_dbf_id
                        LEFT JOIN mgtt_repository_rep
                                ON pk_rep_id = fk_rep_dbf_repo_id
                                AND rep_is_database = true
                        WHERE (i_repo_name is null OR i_repo_name = rep_folder_name)
                        AND (i_version is null OR i_version = dbv.dbv_version_id)
                        AND (i_user is null OR i_user = dbv.dbv_database_user_to_use)
                        AND (i_file_name is null OR i_file_name = dvf_file_name)
                )
        INSERT INTO temp_database_scripts
        SELECT *, null::integer as db_position, null::integer as dependency_position
        FROM raw_data;

        WHILE v_todo > 0 LOOP
                select *
                INTO v_todo
                FROM mgtf_update_temp_database_scripts(v_iterator);

                IF v_todo > 0 then
                        select count(*)
                        INTO v_todo
                        FROM temp_database_scripts where db_position is null;
                END IF;

                v_iterator := v_iterator + 1;
        END LOOP;

        RETURN QUERY
        WITH raw_data AS (
                select *
                FROM (
                        select rep_folder_name, dbv_version_id, dbv_database_user_to_use, dvf_file_name, dvf_position, max(db_position) db_position
                        from temp_database_scripts
                        group by rep_folder_name, dbv_version_id, dbv_database_user_to_use, dvf_file_name, dvf_position
                ) a
                ORDER BY db_position, rep_folder_name, dbv_version_id, dbv_database_user_to_use, dvf_position
        )
        SELECT 
                rep_folder_name,
                dbv_version_id,
                dbv_database_user_to_use,
                (
                        select json_agg( 
                                json_build_object(
                                        'fileName', rd2.dvf_file_name,
                                        'done', false
                                )
                        )
                        FROM raw_data rd2
                        where 
                        rd1.rep_folder_name = rd2.rep_folder_name
                        AND rd1.dbv_version_id = rd2.dbv_version_id
                        AND rd1.dbv_database_user_to_use = rd2.dbv_database_user_to_use
                )
        FROM raw_data rd1
        GROUP BY db_position, rep_folder_name, dbv_version_id, dbv_database_user_to_use
        ORDER BY db_position, rep_folder_name, dbv_version_id, dbv_database_user_to_use;
END;
$CODE$ LANGUAGE plpgsql