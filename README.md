# Today

## Installation

For now, the projects has 2 main folders

### `app`

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

Soon
