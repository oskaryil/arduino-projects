$(document).ready(function() {
  $.ajax({
    type: 'json',
    method: 'get',
    url: '/api/users',
    success: function(users) {
      console.log(users);
      users.forEach(function(user) {
        console.log(user);
        $("#user-count").html(users.length);
      });
    }
  });
});