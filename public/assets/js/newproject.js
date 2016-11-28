$(document).ready(function() {
  $("#summernote").summernote({
    toolbar: [
    // [groupName, [list of button]]
    ['style', ['bold', 'italic', 'underline', 'clear']],
    ['font', ['strikethrough', 'superscript', 'subscript']],
    ['fontsize', ['fontsize']],
    ['color', ['color']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['height', ['height']]
    ],
    disableDragAndDrop: true,
    height: 300
  });
  var fileUrl = "";

  function uploadFile(file, signedRequest, url) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4) {
        if(xhr.status === 200) {
          console.log(url);
          fileUrl = url;
        } else {
          alert('could not upload file.');
        }
      }
    }
    xhr.send(file);
  }

  function getSignedRequest(file) {
    var xhr = new XMLHttpRequest();
    file.name = $.trim(file.name);
    xhr.open('GET', '/sign-s3?file-name='+file.name+'&file-type='+file.type);
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4) {
        if(xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          uploadFile(file, response.signedRequest, response.url);
        } else {
          alert('Could not get signed URL.');
        }
      }
    }
    xhr.send();
  }


  var success = false;

  function returnSuccess() {
    success= true;
  }

  function initUpload() {
    const files = document.getElementById('file-input').files;
    const file = files[0];
    if(file.type === 'image/jpeg' || file.type === 'image/png') {
      getSignedRequest(file);
      return 'success';
    } else {
      // clearFileInput("file-input");
      alert('Only .jpg and .png files are allowed');
    }
    if(file == null) {
      alert('no file selected');
    }
      
  }

  $('#uploadFileBtn').on('click', function(e) {
    
    e.preventDefault();

    if(initUpload() === 'success') {
      $("#uploadFileBtn").animate({
        duration: 300,
        easing: "easein"
      }, function() {
        $("#uploadFileBtn").attr("value", "Success");
      });
    }


  });

  function clearFileInput(id) { 
    var oldInput = document.getElementById(id); 

    var newInput = document.createElement("input"); 

    newInput.type = "file"; 
    newInput.id = oldInput.id; 
    newInput.name = oldInput.name; 
    newInput.className = oldInput.className; 
    newInput.style.cssText = oldInput.style.cssText; 
    // TODO: copy any other relevant attributes 

    oldInput.parentNode.replaceChild(newInput, oldInput); 
  }
});