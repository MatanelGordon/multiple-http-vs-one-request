# multiple http vs one request

This repo allows to test the difference between one http request vs. multiple http requests. 
I built this using vite + express + vanillajs + tailwindcss

## getting started

- `yarn install`
- `yarn dev`

## changing number of requests

- variable `parts` in `apps/backend/src/index.js`
- variable `chunkSize` in `apps/backend/src/index.js`

## changing frontend address

- variable `SERVER_ROUTE` in `apps/frontend/main.js`
- variable `ENABLE_POLLING` in `apps/frontend/main.js`
