// User module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var User = app.module();

  // Default Model.
  User.Model = Backbone.Model.extend({
    defaults:{
      username: "", //String,
      password: "", //String,
      email: "" //String
    },
    url: "register",
    urlRoot: "/"
  });

  // // Default Collection.
  // User.Collection = Backbone.Collection.extend({
  //   model: User.Model
  // });

  // Default View.
  User.Views.Login = Backbone.Layout.extend({
    template: "user/login",
    tagName: "form",
    className: "modal login-form form-horizontal",

    events: {
      "click #login": "login"
    },

    initialize: function() {

    },

    login: function(e) {
      e.preventDefault();
      app.log(this.$el.serialize());
    }

  });

  // Return the module for AMD compliance.
  return User;

});
