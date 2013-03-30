// Main module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Main = app.module();

  // Default Model.
  Main.Model = Backbone.Model.extend({

  });

  // Default Collection.
  Main.Collection = Backbone.Collection.extend({
    model: Main.Model
  });

  // Default View.
  Main.Views.Layout = Backbone.Layout.extend({
    template: "main"
  });

  // Return the module for AMD compliance.
  return Main;

});
