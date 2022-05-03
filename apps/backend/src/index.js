const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT ?? 8000;

app.use(cors());

app.get('/all', (req,res) => {
    res.json({a:1,b:2});
})
app.listen(port, () => {
    console.log(`running in port ${port}`);
})