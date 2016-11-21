$(document).ready(function() {
  $.ajax({
    type: 'json',
    method: 'get',
    url: '/api/user-posts',
    success: function(posts) {
      console.log(posts);
    }
  });
});