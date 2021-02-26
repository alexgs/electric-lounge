# Database server

Database settings and configuration.

## Common Commands

You'll need [Task][1] to do anything. You can run `task --list` to see other commands, or just peek at `Tasklist.yml`.

[1]: https://taskfile.dev/

1. To connect from a Node.js scripting container, first do `task node` to start and get a shell on the scripting container. (Warnings about missing variables can safely be ignored.)
1. From the container, you can do `psql -h database -U $API_DATABASE_USER -d $API_DATABASE_NAME`. You will be prompted for the `$API_DATABASE_PASSWORD`.

## Getting Started

1. Make sure the following keys are set in `../.env`. Values for `API_DATABASE_PASSWORD` and `API_DATABASE_USER` are not strictly necessary, but they are referenced in the instructions below. They are also used by the `../api` package.
```
API_DATABASE_NAME
API_DATABASE_PASSWORD
API_DATABASE_USER
DATABASE_ADMIN_PASSWORD
DATABASE_ADMIN_USER
DATABASE_HOST_DIRECTORY
```
2. Delete previous database files in `$DATABASE_HOST_DIRECTORY`, if any. You can use `task wipe-host-data`.
1. Run `task initialize`.
1. Run `task up` to start the application stack. You can verify that everything is okay with Postgres by checking the logs with `docker-compose logs -f database`.
1. Connect to the cluster from the host, `psql -h localhost -p $DATABASE_PORT -U $DATABASE_ADMIN_USER -d $API_DATABASE_NAME`. As with subsequent commands, you will be prompted for `$DATABASE_ADMIN_PASSWORD`.
1. Execute the following queries
```sql
CREATE ROLE $API_DATABASE_USER
  WITH LOGIN PASSWORD $API_DATABASE_PASSWORD;

REVOKE ALL ON DATABASE $API_DATABASE_NAME
  FROM $API_DATABASE_USER;

GRANT CONNECT ON DATABASE $API_DATABASE_NAME
  TO $API_DATABASE_USER;

REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;

GRANT ALL ON ALL TABLES IN SCHEMA public TO $API_DATABASE_USER;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $API_DATABASE_USER;
```
7. Use `\q` to exit the client.
1. Run `rm ~/.psql_history` to clear the client history (which contains the `$API_DATABASE_PASSWORD`).
1. Use `pg_restore` or other tools to add data to the database.

## References

- There might be useful information in [the corresponding README for Naginata][2].

[2]: https://bitbucket.org/alexgs99/todo-ninja-naginata/src/develop/database/README.md
