var express = require ('express');
var app = express();
var path = require ('path');
var bodyParser = require('body-parser');
var figlet = require ('figlet');

app.set('port', 5000);

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function (req, res) {
  res.sendFile(path.resolve('server/public/views/index.html'));
});


app.get('/data/:name/:details', function (req, res) {
  var name = req.params.name;
  var details = req.params.details;
  res.send(req.params);
});

app.listen(app.get("port"), function ( ) {
    console.log("Listening on port: ", "\n" + figlet.textSync(app.get("port"), {font: "3D-ASCII"}));
});
