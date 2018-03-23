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

The part is a go project that requires go 1.9. It does not vendor anything for now, but that will come.
```bash
cd backend
go run main.go
```

The back will serve the front at `/`. The API routes all start with `/api`

### Oauth2

It is not the case yet but the idea is to put Today behind https://github.com/bitly/oauth2_proxy. Follow their documentation to set it up. I was surprised by how easy it actually was.
