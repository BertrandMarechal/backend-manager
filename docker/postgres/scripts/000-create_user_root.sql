DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT                       -- SELECT list can stay empty for this
      FROM   pg_catalog.pg_roles
      WHERE  rolname = 'root') THEN

      CREATE USER root WITH PASSWORD 'route' SUPERUSER;
   END IF;
END
$do$;