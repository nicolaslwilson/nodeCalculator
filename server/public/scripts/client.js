var leftOperand = "", rightOperand = "", operator = "";
var delayAnimationIntervalID;
var computationDelay = 3000; //Delay before displaying calculation results in ms.

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
  return "<button class='numberButton pure-button pure-u-1-3' id='" + i + "'>" + i + "</button>";
}

function addEventListeners() {
  $('#numPad').on('click', '.numberButton', inputNumber);
  $('.setOperatorButton').on('click', setOperator);
  $('.calculate').on('click', doCalculation);
  $('.clear').on('click', clearCalculator);
}

function removeEventListeners() {
  $('#numPad').off('click', '.numberButton', inputNumber);
  $('.setOperatorButton').off('click', setOperator);
  $('.calculate').off('click', doCalculation);
  $('.clear').off('click', clearCalculator);
}

function updateDisplay () {
  var displayString = assembleDisplayString();
  figletRequest(displayString.leftHand, '3D-ASCII', '#calcDisplay pre.leftDisplay');
  figletRequest(displayString.operator, 'Larry 3D', '#calcDisplay pre.operatorDisplay');
  figletRequest(displayString.rightHand, '3D-ASCII', '#calcDisplay pre.rightDisplay');
}

function assembleDisplayString () {
  var displayString = {
    leftHand: leftOperand || "0",
    operator: operatorToSymbol(operator),
    rightHand: rightOperand
  };
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
      operatorSymbol = "%2F";
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
    alert("Calculator requires a non-zero initial operand before selecting an operator.");
  }
  updateDisplay();
}

function doCalculation() {
  if (leftOperand && rightOperand && operator) {
    if (operator === "divide" && rightOperand === "0") {
      alert("Cannot divide by 0");
      clearCalculator();
    }
    else {
      postCalculation();
    }
  }
  else {
    alertUserEmptyDataField();
  }
}

function alertUserEmptyDataField () {
  var alertString = "";
  if (!leftOperand) {
    alertString += "Missing first operand. ";
  }
  if (!rightOperand) {
    alertString += "Missing second operand. ";
  }
  if (!operator) {
    alertString += "Missing operator.";
  }
  alert(alertString);
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
      clearCalculator();
      leftOperand = res.result;
      computingDelayAnimation("COMPUTING . . . ");
      setTimeout(endDelay, computationDelay);
    }
  });
}

function computingDelayAnimation(message) {
  var waitIndex = 0;
  $('#calcDisplay').css({"overflow": "hidden"});
  $('button').toggleClass('pure-button-disabled');
  removeEventListeners();
  delayAnimationIntervalID = setInterval(function () {
    var waitString = message + message;
    if (waitIndex < waitString.length/2) {
      waitIndex++;
    }
    else {
      waitIndex = 0;
    }
    // console.log(waitString.slice(index, index+7));
    figletRequest(waitString.slice(waitIndex, waitIndex+10), "3D-ASCII", '#calcDisplay pre.leftDisplay');
  }, 200);
}

function endDelay() {
  clearInterval(delayAnimationIntervalID);
  $('#calcDisplay').css({"overflow": "scroll"});
  $('button').toggleClass('pure-button-disabled');
  addEventListeners();
  updateDisplay();
}

function clearCalculator () {
  leftOperand = "";
  rightOperand = "";
  operator = "";
  updateDisplay();
}

function figletRequest (text, font, target) {
  if (text) {
    var requestURL = '/figlet/' + font + '/' + text;
    $.ajax({
      url: requestURL,
      type: 'GET',
      success: function (response) {
        $(target).text(response);
      }
    });
  }
  else {
    $(target).text("");
  }
}
