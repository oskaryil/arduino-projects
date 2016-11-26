$(document).ready(function() {

  $.ajax({
    type: 'json',
    method: 'get',
    url: '/api/users',
    success: function(users) {
      users.forEach(function(user) {
        $("#user-count").html(users.length);
      });
    },
    error: function(error) {
      console.error(error);
    }
  });

  $.ajax({
    type: 'json',
    method: 'get',
    url: '/api/new-users-today',
    success: function(count) {
      $("#new-users-today").html(count);
    },
    error: function(error) {
      console.error(error);
    }
  });

});