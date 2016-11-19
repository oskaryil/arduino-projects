function append(title, content) {
    var grid = document.querySelector('#columns');
    var item = document.createElement('div');
    var h = '<div class="thumbnail">';
    h += '<img src="" alt="">';
    h += '<div class="caption">';
    h += '<h3 class="text-center">';
    h += title;
    h += '</h3>';
    h += '</div>';
    h += '<p class="post-description text-center">'
    h += content;
    h += '</p>';
    h += '</div>';
    salvattore.appendElements(grid, [item]);
    item.outerHTML = h;
}
append('hello', 'yo');
append('hello', 'yo');
append('hello', 'yo');
append('hello', 'yo');
append('hello', 'yo');
append('hello', 'yo');
append('hello', 'yo');
append('hello', 'yo');
append('hello', 'yo');
append('hello', 'yo');
append('hello', 'yo');
append('hello', 'yo');