const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const db = require("./app/models");
const dbConfig = require("./app/config/db.config");


db.mongoose.connect(`mongodb+srv://${dbConfig.HOST}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

var corsOptions = {
  Origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json({limit: '55mb'}));
app.use(bodyParser.urlencoded({limit: '55mb',extended: true, parameterLimit:50000 }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Task & CRM API." });
});

require('./app/routes/overall.routes')(app); 

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
