let express = require('express');
let app = express();
let routes = require('./routes/api.routes')

app.use(express.json());
app.use('/api', routes)

app.get('/', (req, res) => {
    res.status(200).json("Welcome to our Store");
})

module.exports = app;