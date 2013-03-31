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
      // username: "", //String,
      email: "", //String
      password: "", //String,
      token: ""
    },
    url: "/enter",
    //urlRoot: "/",
    initialize: function() {
      this.on("change", this.log);
    },

    log: function() {
      app.log(this.toJSON());
    }
  });

  // // Default Collection.
  // User.Collection = Backbone.Collection.extend({
  //   model: User.Model
  // });

  // Default View.
  User.Views.Login = Backbone.Layout.extend({
    template: "user/login",

    events: {
      "click #login": "login",
      "click #logout": "logout"
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },

    login: function(e) {
      e.preventDefault();
      this.model.save({
        "email": this.$el.find("[name='email']").val(),
        "password": this.$el.find("[name='password']").val(),
        "status": this.$el.find("[name='status']:checked").val()
      });
    },

    logout: function(e) {
      e.preventDefault();

      this.model.set("id","");

      this.model.destroy();
    },

    serialize: function() {
      return this.model.toJSON();
    }

  });

  // Return the module for AMD compliance.
  return User;

});
