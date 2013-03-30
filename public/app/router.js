define([
  // Application.
  "app",
  "modules/wine"
],

function(app, Wine) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {
      app.useLayout(main).setView(
        new Wine.Views.Layout({
          collection: new Wine.Collection
        })
      );
    }
  });

  return Router;

});
