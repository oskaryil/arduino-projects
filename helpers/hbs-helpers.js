var express = require('express');
var hbs = require('express-handlebars');
const config = require('../config.json');

function hbsHelpers(hbs) {
  return hbs.create({
    helpers: {
      copyright_date: function() {
      	return new Date().getFullYear();
      }

      // More helpers...
    }

  });
}

module.exports = hbsHelpers;