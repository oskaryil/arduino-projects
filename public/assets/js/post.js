$(document).ready(function() {
  
  var componentsRaw = $('.post-components').text();
  var components = componentsRaw.split(',');
  components = components.slice(1, this.length);
  var sanitizedComponents = [];

  components.forEach(function(component) {
    component = component.split('');
    if(component[0] === " ") {
      component.splice(0, 1);
    }
    component = component.join('');
    sanitizedComponents.push(component);
  });
  console.log(sanitizedComponents);
});