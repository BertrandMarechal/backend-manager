CREATE OR REPLACE FUNCTION mgtf_get_kms_key_per_path(i_path TEXT, i_first_level boolean default null)
RETURNS json
STABLE
AS $CODE$
DECLARE
    v_path TEXT := '';
BEGIN
    SELECT
            CASE WHEN i_path like '/%' THEN RIGHT(i_path, LENGTH(i_path) - 1)
            ELSE i_path
            END
    INTO v_path;
    IF i_first_level is null THEN
        RETURN (
            SELECT
                    json_build_object(
                        kky_parent.kky_name,
                        COALESCE((
                            SELECT json_object_agg(
                                kky_child.kky_name,
                                (select mgtf_get_kms_key_per_path(kky_child.kky_full_path, true))
                            )
                        FROM mgtt_kms_key_kky kky_child
                        WHERE kky_child.fk_kky_kky_parent_id = kky_parent.pk_kky_id
                        ),('"' || kky_parent.kky_value || '"')::json)
                    )
            FROM mgtt_kms_key_kky kky_parent
            WHERE kky_parent.kky_full_path = v_path
        );
    ELSE
        RETURN (
            SELECT
                COALESCE((
                    SELECT json_object_agg(
                        kky_child.kky_name,
                        (select mgtf_get_kms_key_per_path(kky_child.kky_full_path, true))
                    )
                FROM mgtt_kms_key_kky kky_child
                WHERE kky_child.fk_kky_kky_parent_id = kky_parent.pk_kky_id
                ),('"' || kky_parent.kky_value || '"')::json)
            FROM mgtt_kms_key_kky kky_parent
            WHERE kky_parent.kky_full_path = v_path
        );
    END IF;
END
$CODE$ LANGUAGE plpgsql