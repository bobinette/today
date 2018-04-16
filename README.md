# Today

## Installation

For now, the projects has 2 main folders

### `app`

**node / npm**
When developping:
- node 9.8.0
- npm 5.7.1
In travis (building for production):
- node 8.9.1
- npm 5.5.0

This is where you will find the front end of Today. It is a usual `npm` install and start procedure:
```bash
cd app
npm install
npm run dev
```
**Note**: there is no prod configuration yet.

### `backend`

The part is a go project that requires go 1.9. The dependencies are managed via govendor (`go get -u -v github.com/kardianos/govendor`). To install them and start the server:
```bash
cd backend
govendor sync
go run main.go
```

The back will serve the front at `/`. The API routes all start with `/api`

### Oauth2

Today uses the oauth2 proxy from bitly to handle authentication: https://github.com/bitly/oauth2_proxy. You will find all the information for download and starting in their README.

## Docker

### `app`

Similar to the `backend` folder:
```bash
cd app
docker build -t today-app:latest
docker run --name 'today-app' -d -p 9192:80 'today-app:latest'
```

### `backend`

Build the docker with:
```bash
cd backend
docker build -t today:latest .
```

Then copy `conf.toml.dist` into a `conf.docker.toml`. You will need to give the url of the front docker:
```toml
[app]
dir = ""
proxy_to = "http://192.168.50.1:9192"
```

Now you can run your docker like so:
```bash
docker run --name today -d -v $(pwd)/backend/conf.docker.toml:/root/conf.toml -v $(pwd)/backend/docker-index:/root/index -p 127.0.0.1:9091:9091 today:latest
```

You can also use environment variables for the configuration, replacing the dots in the paths with underscores, e.g. `mysql.host` in the toml file becomes the `MYSQL_HOST` env var.

And then start the `oauth2_proxy` as described above
