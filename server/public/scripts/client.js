$(document).ready(function() {
  $('.calculate').on('click', function () {
    var leftOperand = $('#leftOperand').val();
    var rightOperand = $('#rightOperand').val();
    var operator = $(this).data("operator");
    var calculationData = {
      operator: operator,
      leftOperand: leftOperand,
      rightOperand: rightOperand
    };
    $.ajax({
      type: "POST",
      url: "/calculate",
      data: calculationData,
      success: function (res) {
        console.log(res);
      }
    });
  });
});
