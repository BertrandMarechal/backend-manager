DROP FUNCTION IF EXISTS mgtf_update_settings(json);
DROP FUNCTION IF EXISTS mgtf_get_repositories();
DROP FUNCTION IF EXISTS mgtf_get_settings();
DROP FUNCTION IF EXISTS mgtf_insert_database_files(TEXT[]);
DROP FUNCTION IF EXISTS mgtf_update_repo_folders(TEXT[]);

DROP TABLE IF EXISTS mgtt_setting_set;
DROP TABLE IF EXISTS mgtt_repository_parameter_rpa;
DROP TABLE IF EXISTS mgtt_database_version_file_dbf;
DROP TABLE IF EXISTS mgtt_database_version_dependencies_dvd;
DROP TABLE IF EXISTS mgtt_database_files_dfb;
DROP TABLE IF EXISTS mgtt_database_version_dbv;
DROP TABLE IF EXISTS mgtt_repository_rep;