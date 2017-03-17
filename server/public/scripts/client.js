var leftOperand = "", rightOperand = "", operator;

$(document).ready(function() {
  appendDOM();
  addEventListeners();
  updateDisplay();
});

function appendDOM() {
  var numArray = [1,2,3,4,5,6,7,8,9,0];
  for (var i = 0; i < numArray.length; i++) {
    $('#numPad').append(createNumberButton(numArray[i]));
  }
}
function createNumberButton(i) {
  console.log("Creating button ", i);
  return "<button class='numberButton' id='" + i + "'>" + i + "</button>";
}

function addEventListeners() {
  $('#numPad').on('click', '.numberButton', inputNumber);
  $('.setOperatorButton').on('click', setOperator);
  $('.calculate').on('click', doCalculation);
}

function updateDisplay () {
  getFigletText(assembleDisplayString());
}

function assembleDisplayString () {
  var displayString;
  if (operator) {
    displayString = leftOperand + operatorToSymbol(operator) + rightOperand;
  }
  else if (leftOperand) {
    displayString = leftOperand;
  }
  else {
    displayString = "0";
  }
  return displayString;
}

function operatorToSymbol (operator) {
  var operatorSymbol;
  switch (operator) {
    case "add":
      operatorSymbol = "+";
      break;
    case "subtract":
      operatorSymbol = "-";
      break;
    case "multiply":
      operatorSymbol = "X";
      break;
    case "divide":
      operatorSymbol = "/";
      break;
  }
  return operatorSymbol;
}

function inputNumber() {
  console.log("input: ", $(this).attr('id'));
  if (operator) {
    rightOperand += $(this).attr('id');
  } else {
    leftOperand += $(this).attr('id');
  }
  updateDisplay();
}

function setOperator () {
  console.log("set operator: ", $(this).data("operator"));
  operator = $(this).data("operator");
  updateDisplay();
}

function doCalculation() {
  if (leftOperand && rightOperand && operator) {
    postCalculation();
  } else {
    alert("Please input all required data");
  }
}

function postCalculation() {
  var calculationData = {
    operator: operator,
    leftOperand: parseInt(leftOperand),
    rightOperand: parseInt(rightOperand)
  };
  $.ajax({
    type: "POST",
    url: "/calculate",
    data: calculationData,
    success: function (res) {
      leftOperand = res.result;
      rightOperand = "";
      operator = undefined;
      updateDisplay();
    }
  });
}

function getFigletText (figletText) {
  console.log('get figlet');
  $.ajax({
    url: '/figlet',
    type: 'POST',
    data: {text: figletText},
    success: function (response) {
      $('#calcDisplay pre').text(response);
    }});
}
