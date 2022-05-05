const express = require('express');
const cors = require('cors');
const _ = require('lodash');
const axios = require('axios');
const bigRequest = require('./bigRequest.json');
const smallRequest = require('./smallRequest.json');

const app = express();
const port = process.env.PORT ?? 8000;

const getFetch = async (url) => {
    const result = await axios.get(url);
    return result.data;
}

app.use(cors());

const parts = 10;
app.get('/all', async (req,res) => {
    const fetches = _.chain(new Array(parts))
    .map((_, i) => i + 1)
    .map(id => `http://localhost:${port}/partial/${id}`)
    .map(getFetch)
    .value()

    const results = await Promise.all(fetches);
    res.json(results.flat());
})

app.get('/partial/:id', (req,res) => {
    const size = Math.ceil(bigRequest.length / parts);
    const {id} = req.params;
    const obj = bigRequest.slice(size * (id - 1), size * id);
    res.json(obj);
})

app.get('/parts', (_,res) => {
    res.json({parts})
})

app.get('/small', (req,res) => {
    res.json(smallRequest);
})

app.listen(port, () => {
    console.log(`running in port ${port}`);
})