$(document).ready(function() {
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


  function initUpload() {
    const files = document.getElementById('file-input').files;
    const file = files[0];
    if(file == null) {
      alert('no file selected');
    }
    getSignedRequest(file);
    return 'success';
  }

  // $('#file-input').on('change', function() {
    
  //   if(initUpload() === 'success') {
  //     $(".status").text('Filen har laddats upp utan problem!');
  //   }


  // });
});