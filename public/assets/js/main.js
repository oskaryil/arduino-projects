$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});

$(document).ready(function() {

function append(title, content, components, imgUrl, author, postID) {
    var grid = document.querySelector('#columns');
    var item = document.createElement('div');
    var h = '<div class="thumbnail">';
    // h += '<div class="thumbnail-content-wrapper">'
    h += '<img class="posts-img" src="'+imgUrl+'" alt="">';
    h += '<div class="caption">';
    h += '<h3 class="text-center posts-title">';
    h += title;
    h += '</h3>';
    h += '</div>';
    h += '<div class="posts-description text-center">';
    h += content;
    h += '</div>';
    // h += '<p class="components text-center">Components: ';
    // h += components;
    // h += '</p>';
    h += '<p class="post-author text-center text-info">Posted by: ';
    h += author.username;
    h += '</p>';
    // h += '</div>';
    h += '<a class="btn btn-info center-block read-more-btn" href="/posts/'+postID+'">Read More</a>';
    h += '</div>';
    salvattore.appendElements(grid, [item]);
    item.outerHTML = h;
}

// var readMoreBtnHeight = $(".read-more-btn").height();
// $(".thumbnail-content-wrapper").css('height', 520-readMoreBtnHeight);

var $postTitle = $(".posts-title");
if($postTitle.text().length >= 25) {
  $postTitle.css("font-size", "1.25em")
}


$.ajax({
    type: 'json',
    method: 'get',
    url: '/api/posts',
    success: function(data) {
        console.log(data);
        data.forEach(function(post) {
            console.log(post);
            console.log(post.description.length);
            var description = post.description;
            if(post.description.length >= (46) ) {
              description = `${post.description.substring(0, 150)}...`;
            }
            append(post.postTitle, description, post.components, post.imgUrl, post.author, post._id);
        });
    }
});

$(".posts-img").lazyload({
  threshold: 200
});

// $(function() {
//   console.log($("#columns .col-md-4"));
//   console.log(  $("#columns .col-md-4").slice(0, 6).show()
// );
//   $("#columns div").slice(0, 6).show();
//   if($("#columns div").length > 6) {
//     $("#loadMore").show();
//   } else {
//     $("#loadMore").hide();
//   }
//   $("#loadMore").on('click', function(e) {
//     e.preventDefault();
//     $("#columns div:hidden").slice(0, 6).slideDown();
//     if($("#columns div:hidden").length == 0) {
//       $("#load").fadeOut("slow");
//     }

//     $("html, body").animate({
//       scrollTop: $(this).offset().top
//     }, 1500);
//   });
// });

  // $(".animsition").animsition({
  //   inClass: 'fade-in',
  //   outClass: 'fade-out',
  //   inDuration: 3000,
  //   outDuration: 800,
  //   linkElement: '.animsition-link',
  //   // e.g. linkElement: 'a:not([target="_blank"]):not([href^="#"])'
  //   loading: true,
  //   loadingParentElement: 'body', //animsition wrapper element
  //   loadingClass: 'animsition-loading',
  //   loadingInner: '', // e.g '<img src="loading.svg" />'
  //   timeout: false,
  //   timeoutCountdown: 5000,
  //   onLoadEvent: true,
  //   browser: [ 'animation-duration', '-webkit-animation-duration'],
  //   // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
  //   // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
  //   overlay : false,
  //   overlayClass : 'animsition-overlay-slide',
  //   overlayParentElement : 'body',
  //   transition: function(url){ window.location.href = url; }
  // });





});
