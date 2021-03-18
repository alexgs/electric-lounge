# Webapp

Next.js project

To run `node` or `npm`, install [Task][1] and use `task node`.

[1]: https://taskfile.dev/

## How to deploy

1. Run `task version-<type>`, changing `<type>` to one of "major," "minor," or "patch" as appropriate.
1. Run `task docker` to build and tag the docker image and to push the image to the public Docker repository.
1. _WIP: Probably need to update the Docker Compose file in devops or something..._
1. **Profit!** :moneybag: :grin: :moneybag:
