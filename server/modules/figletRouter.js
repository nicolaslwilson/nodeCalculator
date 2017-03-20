var express = require('express');
var router = express.Router();
var figlet = require ('figlet');

router.get('/:font/:text', function (req, res) {
  var text = req.params.text;
  var font = req.params.font;
  console.log('figlet hit', text, font);
  figlet.text(text, {font: font, horizontalLayout: 'default', verticalLayout: 'default'}, function (err,data) {
    console.log(data);
    res.send(data);
  });
});

module.exports.router = router;
module.exports.figlet = figlet;
