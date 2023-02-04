# multiple http vs one request

This repo allows to test the difference between one http request vs. multiple http requests.

I built this using vite + express + vanillajs + tailwindcss

## getting started

- `npm install`
- `npm run dev`

## changing number of requests

- variable `PARTS` in `apps/backend/src/index.js`
- variable `CHUNK_SIZE` in `apps/backend/src/index.js`
- variable `ENABLE_POLLING` in `apps/frontend/main.js`

> All variables are available as environment variables;

## changing frontend address

- variable `PORT` in `apps/frontend/main.js`

> Also available as environment variables "VITE_PORT"
