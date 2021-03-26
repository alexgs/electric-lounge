# Webapp

Next.js project

To run `node` or `npm`, install [Task][1] and use `task node`.

[1]: https://taskfile.dev/

## TODO

- [ ] Configure cron job to grab regular snapshots
- [x] Take a look at using [Prisma Migrate][2] and [Push][3] in ongoing development.

[2]: https://www.prisma.io/docs/guides/application-lifecycle/developing-with-prisma-migrate
[3]: https://www.prisma.io/docs/guides/application-lifecycle/prototyping-schema-db-push

## How to deploy

1. Run `task version:<type>`, changing `<type>` to one of "major," "minor," or "patch" as appropriate.
1. If the database changed, do something like `npx prisma migrate dev --name migration_<version>` (where version uses `_` (underscore) to separate major, minor, and patch values).
1. Run `task build` to build and tag the docker image and to push the image to the public Docker repository.
1. Update the Docker Compose file for the host to use the new version. SSH to the host and do `task up` to download and deploy the latest version.
1. If the database changed, connect to the container with `docker exec -it electric-lounge sh`. Then you can do something like `npx prisma migrate deploy` to apply migrations to the database.
1. **Profit!** :moneybag: :grin: :moneybag:
