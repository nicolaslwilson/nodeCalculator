//Creates express server
var express = require ('express');
var app = express();

//Load middleware
var path = require ('path');
var bodyParser = require('body-parser');

//math.js to the perform the serverside calculations
var math = require ('mathjs');

//Loads router for figlet requests.
var figletRouter = require ('./modules/figletRouter.js');

//Set port
app.set('port', 5000);

//Use middleware
app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));

//Index.html
app.get('/', function (req, res) {
  res.sendFile(path.resolve('server/public/views/index.html'));
});

//Takes in calculationData from a POST request and returns the result
app.post('/calculate', function (req, res) {
  console.log(req.body);
  var operator = req.body.operator;
  var leftOperand = req.body.leftOperand;
  var rightOperand = req.body.rightOperand;
  res.send({result: math[operator](leftOperand,rightOperand)});
});

//Routes for figlet requests
app.use('/figlet', figletRouter.router);

//Listen on set port.
app.listen(app.get("port"), function () {
    figletRouter.figlet.text(app.get("port"), {font: "3D-ASCII"}, function (err, data) {
      console.log("Listening on port: ", "\n" + data);
    });
});
