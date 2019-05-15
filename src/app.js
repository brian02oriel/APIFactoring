const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cors = require('cors');

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors({
    origin: true,
    methods:["GET"]
}));


//Routes
require('./routes/userRoutes')(app);
require('./routes/factoringRoutes')(app);

app.listen(app.get('port'), () => {
    console.log("server on port 3000");
})