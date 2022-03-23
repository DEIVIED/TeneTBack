const express = require('express');
const datalayer = require('./datalayer/datalayer');
const routeForm = require('./router/route.form');
const routePublication = require('./router/route.publication');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: './.env' });




const app = express();
app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));


// app.use(flash());


const host = "localhost";
const port = 9990;

app.use(cookieParser());
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/', routeForm);
app.use('/', routePublication);


datalayer.connectionDB();



app.listen(port, host, () => {
    try {
        console.log(`server running on ${host}:${port}`);
    } catch (error) {
        console.error(error);
    }
});