define([
  // Application.
  "app",
  "modules/user"
],

function(app, User) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "/login": "index",
      "/usernotes": "notes"
    },

    initialize: function() {
      var entity = {
        user: new User.Model
      };

      _(this).extend(entity);

    },

    checkAuth: function() {
      if (this.user.get("state") == "")
        return this.navigate("/", {trigger: true});
    },

    index: function() {
      app.useLayout(main).setView(
        new User.Views.Login({
          model: this.user
        })
      ).render();
    },

    notes: function() {
      //this.checkAuth();
      app.log("ahoy!");
      // app.useLayout(main).setView({

      // });
    }


  });

  return Router;

});
