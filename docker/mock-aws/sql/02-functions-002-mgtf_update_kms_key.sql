CREATE OR REPLACE FUNCTION mgtf_update_kms_key(i_path TEXT, i_value TEXT, i_parent_id INTEGER default null)
RETURNS integer
VOLATILE
AS $CODE$
DECLARE
        v_parent_id INTEGER := -1;
        v_path_array TEXT[];
        v_path TEXT;
        v_path_array_item TEXT := '';
        v_previous_path TEXT := null;
        v_current_path TEXT := null;
BEGIN
        -- EASY case : we have the full path => we update
        SELECT
                CASE WHEN i_path like '/%' THEN RIGHT(i_path, LENGTH(i_path) - 1)
                ELSE i_path
                END
        INTO v_path;
        IF EXISTS (
                select 1
                from mgtt_kms_key_kky
                WHERE kky_full_path = v_path
        ) THEN
                UPDATE mgtt_kms_key_kky
                SET kky_value = i_value
                WHERE kky_full_path = v_path;
        ELSE
                --we don't have the full path
                --we might have to create the hierarchy one by one
                SELECT 
                        string_to_array(
                        v_path
                        ,'/')::TEXT[]
                INTO v_path_array;
                
                FOREACH v_path_array_item IN ARRAY v_path_array
                LOOP
                        IF v_path_array_item != '' THEN
                                SELECT
                                        CASE WHEN v_current_path IS NULL THEN v_path_array_item
                                        ELSE v_current_path || '/' || v_path_array_item
                                        END
                                INTO v_current_path;
                                
                                --insert
                                INSERT INTO mgtt_kms_key_kky(
                                        kky_name,
                                        kky_full_path,
                                        kky_value,
                                        fk_kky_kky_parent_id)
                                VALUES (
                                        v_path_array_item,
                                        v_current_path,
                                        CASE WHEN v_current_path = v_path THEN i_value ELSE null END,
                                        (select kky_p.pk_kky_id from mgtt_kms_key_kky kky_p where kky_p.kky_full_path = v_previous_path)
                                )
                                ON CONFLICT (kky_full_path) DO NOTHING;
                                
                                SELECT v_current_path
                                INTO v_previous_path;
                        END IF;
                END LOOP;
        END IF;
        RETURN 1;
END
$CODE$ LANGUAGE plpgsql