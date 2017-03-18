var leftOperand = "", rightOperand = "", operator = "";

$(document).ready(function() {
  appendDOM();
  addEventListeners();
  updateDisplay();
});

function appendDOM() {
  var numArray = [0,9,8,7,6,5,4,3,2,1];
  for (var i = 0; i < numArray.length; i++) {
    $('#numPad').prepend(createNumberButton(numArray[i]));
  }
}
function createNumberButton(i) {
  console.log("Creating button ", i);
  return "<button class='numberButton pure-button pure-u-1-3' id='" + i + "'>" + i + "</button>";
}

function addEventListeners() {
  $('#numPad').on('click', '.numberButton', inputNumber);
  $('.setOperatorButton').on('click', setOperator);
  $('.calculate').on('click', doCalculation);
  $('.clear').on('click', clearCalculator);
}

function updateDisplay () {
  assembleDisplayString();
}

function assembleDisplayString () {
  var displayString = {
    leftHand: leftOperand || "0",
    operator: operatorToSymbol(operator),
    rightHand: rightOperand
  };
  getFigletText(displayString);
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
    default:
      operatorSymbol = "";
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
  if (leftOperand) {
    operator = $(this).data("operator");
  }
  else {
    alert("Calculator requires a leftHand operand before selecting an operator.");
  }
  updateDisplay();
}

function doCalculation() {
  if (leftOperand && rightOperand && operator) {
    if (operator === "divide" && rightOperand === "0") {
      alert("Cannot divide by 0");
      clearCalculator();
    } else {
      postCalculation();
    }
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
      operator = "";
      updateDisplay();
    }
  });
}

function clearCalculator () {
  leftOperand = "";
  rightOperand = "";
  operator = "";
  updateDisplay();
}

function getFigletText (displayString) {
  console.log('get figlet');
  $.ajax({
    url: '/figlet',
    type: 'POST',
    data: {text: displayString.leftHand},
    success: function (response) {
      $('#calcDisplay pre.leftDisplay').text(response);
    }
  });
  $.ajax({
      url: '/figlet/operator',
      type: 'POST',
      data: {text: displayString.operator},
      success: function (response) {
        $('#calcDisplay pre.operatorDisplay').text(response);
      }
    });
    $.ajax({
        url: '/figlet',
        type: 'POST',
        data: {text: displayString.rightHand},
        success: function (response) {
          $('#calcDisplay pre.rightDisplay').text(response);
        }
    });
}
