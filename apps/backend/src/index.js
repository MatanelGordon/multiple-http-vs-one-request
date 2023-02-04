const express = require("express");
const cors = require("cors");
const nocache = require('nocache');
const axios = require("axios");
const createRequestBody = require('./createRequest');

const PARTS = process.env['PARTS'] ?? 30;
const CHUNK_SIZE = process.env['CHUNK_SIZE'] ?? 5;
const ENABLE_POLLING = process.env['ENABLE_POLLING'] ?? true;

const bigRequest = createRequestBody(PARTS * CHUNK_SIZE);

const app = express();
const port = process.env['VITE_PORT'] ?? 8000;

const getFetch = async (url) => {
  const result = await axios.get(url);
  return result.data;
};

app.use(cors());
app.use(nocache());

app.use((req, _, next) => {
  console.log(`incoming: ${req.url}`);
  next();
});

app.set('Etag', false);

app.get("/settings", (_, res) => {
  res.json({ PARTS, CHUNK_SIZE, ENABLE_POLLING });
});

app.get("/all", async (req, res) => {
  const fetches = new Array(PARTS).fill(0).map((_, i) => {
    const id = i + 1;
    const addr = `http://localhost:${port}/partial/${id}`;
    return getFetch(addr);
  });

  const results = await Promise.all(fetches);
  res.json(results.flat());
});

app.get("/partial/:id", (req, res) => {
  const size = Math.ceil(bigRequest.length / PARTS);
  const { id } = req.params;
  if(!parseInt(id)) { res.status(400).json({message: `could not find id ${id}`, input: id}) }
  const obj = bigRequest.slice(size * (id - 1), size * id);
  res.json(obj);
});

app.get('/chunk/:index', (req, res) => {
  const {index} = req.params;

  if(!parseInt(index) && parseInt(index) !== 0) { res.status(400).json({message: `invalid index ${index}`, input: index}); return; }
  const results = bigRequest.slice(+index, +index + CHUNK_SIZE);
  res.json({
    results,
    next: results.length > 0 ? +index + results.length : null
  })
})

app.listen(port, () => {
  console.log(`running in port ${port}`);
});
