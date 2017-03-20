var leftOperand = "", rightOperand = "", operator = "";
var delayAnimationIntervalID;
var computationDelay = 3000; //Delay before displaying calculation results in ms.

$(document).ready(function() {
  appendDOM();
  addEventListeners();
  updateDisplay();
});

/**
 * Appends numPad button elements to DOM
 * @function appendDOM
 * @returns
 */
function appendDOM() {
  var numArray = [0,9,8,7,6,5,4,3,2,1];
  for (var i = 0; i < numArray.length; i++) {
    $('#numPad').prepend(createNumberButton(numArray[i]));
  }
}

/**
 * Creates a string
 * @function createNumberButton
 * @param {number} i  The number which the button will represent.
 * @returns {string} An HTML string containing a button
 */
function createNumberButton(i) {
  return "<button class='numberButton pure-button pure-u-1-3' id='" + i + "'>" + i + "</button>";
}

/**
 * Adds event listeners to the calculators buttons.
 * @function addEventListeners
 */
function addEventListeners() {
  $('#numPad').on('click', '.numberButton', inputNumber);
  $('.setOperatorButton').on('click', setOperator);
  $('.calculate').on('click', doCalculation);
  $('.clear').on('click', clearCalculator);
}

/**
 * Removes event listeners
 * @function removeEventListeners
 */
function removeEventListeners() {
  $('#numPad').off('click', '.numberButton', inputNumber);
  $('.setOperatorButton').off('click', setOperator);
  $('.calculate').off('click', doCalculation);
  $('.clear').off('click', clearCalculator);
}

/**
 * Updates #calcDisplay with ASCII text via figlet.js
 * @function updateDisplay
 */
function updateDisplay () {
  var displayString = assembleDisplayString();
  figletRequest(displayString.leftHand, '3D-ASCII', '#calcDisplay pre.leftDisplay');
  figletRequest(displayString.operator, 'Larry 3D', '#calcDisplay pre.operatorDisplay');
  figletRequest(displayString.rightHand, '3D-ASCII', '#calcDisplay pre.rightDisplay');
}

/**
 * Creates an object representing the data input to the calculator to be sent to the server.
 * @function assembleDisplayString
 * @returns {object}  An object with properties representing the different parts of the
 *                    calculation to be performed.
 */
function assembleDisplayString () {
  var displayString = {
    leftHand: leftOperand || "0",
    operator: operatorToSymbol(operator),
    rightHand: rightOperand
  };
  return displayString;
}

/**
 * Converts a string representing a math operation to a symbol representing that same operation.
 * @function  operatorToSymbol
 * @param {string}  operator  Operator to be converted.
 * @returns {string} String containing a character representing the  mathematical operation.
 */
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
      //We use the forward slash character to represent division in #calcDisplay.
      //Since we use send this to the server in the URL of a GET request we need
      //to use the character code instead of the character itself.
      operatorSymbol = "%2F";
      break;
    default:
      operatorSymbol = "";
  }
  return operatorSymbol;
}

/**
 * Logic for handling what should when a number button is clicked.
 * If an operation has been selected we can assume the user is inputing a number
 * as part of the right operand. Otherwise, we can assume the number input is part
 * of the left operand.
 * @function inputNumber
 */
function inputNumber() {
  console.log("input: ", $(this).attr('id'));
  var num = $(this).attr('id');
  if (operator) {
    rightOperand = concatenateNumberString(rightOperand, num);
  } else {
    leftOperand = concatenateNumberString(leftOperand, num);
  }
  updateDisplay();
}

function concatenateNumberString (operand, num) {
  if (operand === "0") {
    operand = num;
  }
  else {
    operand += num;
  }
  return operand;
}

/**
 * Assigns a value to the operator variable based on which operator button was clicked.
 * @function setOperator
 */
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

/**
 * Checks if input is valid, if so sends data to server to calculate result.
 * @function doCalculation
 */
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

/**
 * Checks inputs and alerts user if any are missing.
 * @function alertUserEmptyDataField
 */
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

/**
 * Sends a POST request to the sever with calculationData and upon succes updates
 * the DOM with the result.
 * @function postCalculation
 */
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
      operator = "";
      rightOperand = "";
      computingDelayAnimation("COMPUTING . . . ");
      setTimeout(endDelay, computationDelay);
    }
  });
}

/**
 * Animates a message string inside #calcDisplay and disables buttons until after delay.
 * @function computingDelayAnimation
 * @param {string} message  The message to be animated.
 */
function computingDelayAnimation(message) {
  var index = 0;
  $('#calcDisplay').css({"overflow": "hidden"});
  $('calcDisplay pre').text("");
  $('button').toggleClass('pure-button-disabled');
  removeEventListeners();
  delayAnimationIntervalID = setInterval(function () {
    var waitString = message + message;
    if (index < waitString.length/2) {
      index++;
    }
    else {
      index = 0;
    }
    // console.log(waitString.slice(index, index+7));
    figletRequest(waitString.slice(index, index+10), "3D-ASCII", '#calcDisplay pre.leftDisplay');
  }, 200);
}

/**
 * Ends delay animation and updates DOM with calculation resutl.
 * @function endDelay
 */
function endDelay() {
  clearInterval(delayAnimationIntervalID);
  $('#calcDisplay').css({"overflow": "scroll"});
  $('button').toggleClass('pure-button-disabled');
  addEventListeners();
  updateDisplay();
}

/**
 * Clears all data on calculator and resets display.
 * @function clearCalculator
 */
function clearCalculator () {
  leftOperand = "";
  rightOperand = "";
  operator = "";
  updateDisplay();
}

/**
 * Sends a GET request to the figlet.js on the server with text and a FIG font.
 * @function figletRequest
 * @param {string} text The text to be converted
 * @param {string} font The FIG font which the text should be converted to.
 * @param {string} target A string containing a jQuery selector indicating where
                          on the page the text should be inserted.
 */
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
