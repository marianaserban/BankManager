const express = require('express');
var cors = require('cors')
const routes=require('./routes')
const app = express();
var morgan = require('morgan');

const port = 3000;

app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
});
app.use('/', routes)