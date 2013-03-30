define([
  // Application.
  "app",
  "modules/user"
],

function(app, User) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {
      app.useLayout(main).setView(
        new User.Views.Login({
          model: new User.Model
        })
      ).render();
    }
  });

  return Router;

});
