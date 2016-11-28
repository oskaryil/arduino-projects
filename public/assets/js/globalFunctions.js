function flashMessage(type, msg) {
  var $statusArea = $("#status-area");
  $statusArea.addClass('alert-'+type);

  $statusArea.fadeIn();

  $statusArea.html("");

  $statusArea.append("Your post was successfully removed");

  $statusArea.fadeOut(3000);
}