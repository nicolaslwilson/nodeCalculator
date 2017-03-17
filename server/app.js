var express = require ('express');
var app = express();
var path = require ('path');
var bodyParser = require('body-parser');
var figlet = require ('figlet');
var math = require ('mathjs');

app.set('port', 5000);

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.get('/', function (req, res) {
  res.sendFile(path.resolve('server/public/views/index.html'));
});

app.post('/calculate', function (req, res) {
  console.log(req.body);
  var operator = req.body.operator;
  var leftOperand = req.body.leftOperand;
  var rightOperand = req.body.rightOperand;
  res.send({result: math[operator](leftOperand,rightOperand)});
});

app.listen(app.get("port"), function ( ) {
    console.log("Listening on port: ", "\n" + figlet.textSync(app.get("port"), {font: "3D-ASCII"}));
});
