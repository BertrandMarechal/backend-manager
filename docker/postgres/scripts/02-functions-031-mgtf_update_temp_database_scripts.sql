CREATE OR REPLACE FUNCTION mgtf_update_temp_database_scripts(i_level integer)
RETURNS INTEGER
VOLATILE
AS $CODE$
DECLARE
        v_row_changed integer := 0;
BEGIN
        IF i_level = -1 AND EXISTS (
                SELECT 1
                FROM temp_database_scripts
                WHERE db_position IS NULL)
        THEN
                  UPDATE temp_database_scripts
                  SET db_position = 0
                  WHERE depending IS NULL
                  AND dbv_database_to_use = 'postgres';
                  
                  UPDATE temp_database_scripts
                  SET dependency_position = 1
                  WHERE dbv_version_id in (
                        select dbv_version_id
                        FROM temp_database_scripts
                        WHERE db_position = 0
                  );
                  
                RETURN 1;
        ELSEIF EXISTS (
                SELECT 1
                FROM temp_database_scripts
                WHERE db_position = i_level
        ) THEN
                RETURN 1;
        ELSE
                UPDATE temp_database_scripts
                SET db_position = i_level + 1
                WHERE depending in(
                        select pk_dbv_id
                        FROM temp_database_scripts
                        WHERE db_position = i_level
                  );
                GET DIAGNOSTICS v_row_changed = ROW_COUNT;
                RETURN v_row_changed;
        END IF;
        
END;
$CODE$ LANGUAGE plpgsql