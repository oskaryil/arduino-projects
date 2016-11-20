function append(title, content, components, imgUrl, author, postID) {
    var grid = document.querySelector('#columns');
    var item = document.createElement('div');
    var h = '<div class="thumbnail">';
    h += '<img class="img-responsive posts-img" src="'+imgUrl+'" alt="">';
    h += '<div class="caption">';
    h += '<h3 class="text-center">';
    h += title;
    h += '</h3>';
    h += '</div>';
    h += '<p class="post-description text-center">';
    h += content;
    h += '</p>';
    h += '<p class="components">';
    h += components;
    h += '</p>';
    h += '<p class="post-author text-center">';
    h += author;
    h += '</p>';
    h += '<a href="/posts/'+postID+'">Read More</a>';
    h += '</div>';
    salvattore.appendElements(grid, [item]);
    item.outerHTML = h;
}


$.ajax({
    type: 'json',
    method: 'get',
    url: '/api/posts',
    success: function(data) {
        console.log(data);
        data.forEach(function(post) {
            console.log(post);
            append(post.postTitle, post.description, post.components, post.imgUrl, post.author.name, post._id);
        });
    }
});

