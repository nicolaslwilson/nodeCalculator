$(document).ready(function() {
  $('#submitButton').on('click', function () {
    var name = $('#nameAdd').val();
    var details = $('#detailsAdd').val();
    $.ajax({
      type: "GET",
      url: "data/" + name + "/" + details,
      success: function (res) {
        console.log(res);
      }
    });
  });
});
