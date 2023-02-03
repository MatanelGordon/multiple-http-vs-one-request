const express = require("express");
const cors = require("cors");
const nocache = require('nocache');
const axios = require("axios");
const createRequestBody = require('./createRequest');
const parts = 30;
const chunkSize = 5;
const bigRequest = createRequestBody(parts * chunkSize);

const app = express();
const port = process.env.PORT ?? 8000;

const getFetch = async (url) => {
  const result = await axios.get(url);
  return result.data;
};

app.use(cors());
app.use(nocache());

app.use((req, res, next) => {
  console.log(`incoming: ${req.url}`);
  next();
});

app.set('Etag', false);

app.get("/all", async (req, res) => {
  const fetches = new Array(parts).fill(0).map((_, i) => {
    const id = i + 1;
    const addr = `http://localhost:${port}/partial/${id}`;
    return getFetch(addr);
  });

  const results = await Promise.all(fetches);
  res.json(results.flat());
});

app.get("/partial/:id", (req, res) => {
  const size = Math.ceil(bigRequest.length / parts);
  const { id } = req.params;
  if(!parseInt(id)) { res.status(400).json({message: `could not find id ${id}`, input: id}) }
  const obj = bigRequest.slice(size * (id - 1), size * id);
  res.json(obj);
});

app.get("/settings", (_, res) => {
  res.json({ parts, chunkSize });
});

app.listen(port, () => {
  console.log(`running in port ${port}`);
});
