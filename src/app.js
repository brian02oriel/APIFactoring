const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

//Routes
require('./routes/userRoutes')(app);
require('./routes/factoringRoutes')(app);
app.listen(app.get('port'), () => {
    console.log("server on port 3000");
})