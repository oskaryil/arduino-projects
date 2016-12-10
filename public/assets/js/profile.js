$(document).ready(function() {
  
  var posts;

  $.ajax({
    type: 'json',
    method: 'get',
    url: '/api/user-posts',
    success: function(posts) {
      posts = posts;
      console.log(posts);
    }
  });

  var $removeBtn = $('.profile-remove-post-btn');

  $removeBtn.on('click', function(e) {
    e.preventDefault();
    var $h3tag = $(e.target.parentElement);

    var postID = $h3tag.parent()[0].id;

    $.ajax({
      method: 'post',
      type: 'json',
      url: '/api/remove-post',
      data: {
        postID: postID
      },
      success: function(data) {
        if(data.success) {
          $("#"+postID).fadeOut(1000);
          setTimeout(function() {
            flashMessage("success", "Your post was successfully removed.");
          }, 500);
        } else {
          alert('an error occured when deleting your post');     
        }
      }
    });
  });
});