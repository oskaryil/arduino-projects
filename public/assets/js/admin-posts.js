$(document).ready(function() {

  var $deleteBtn = $('#delete-post-btn');


  $deleteBtn.on('click', function(e) {
    var checkedPosts = $('input[type="checkbox"]:checked');
    var checkedPostsId = {0: []};
    for(var i = 0; i < checkedPosts.length; i++) {
      checkedPostsId[0].push(checkedPosts[i].id);
    }
    $.ajax({
      method: 'post',
      type: 'json',
      url: '/admin/posts/deletePost',
      data: checkedPostsId,
      success: function(data) {
        if(data.success) {
          location.reload();
        } else {
          alert('an error occured while trying to delete the selected posts');
        }
      }
    });

  });
});