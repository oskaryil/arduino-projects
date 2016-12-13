$(document).ready(function() {
  $("#summernote").summernote({
    toolbar: [
    // [groupName, [list of button]]
    ['style', ['bold', 'italic', 'underline', 'clear']],
    ['font', ['strikethrough', 'superscript', 'subscript']],
    ['fontsize', ['fontsize']],
    ['fontname', ['Lato', 'Arial', 'Arial Black', 'Helvetica']],
    ['color', ['color']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['height', ['height']]
    ],
    disableDragAndDrop: true,
    height: 300
  });


});