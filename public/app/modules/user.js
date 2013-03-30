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
      state: ""
    },
    // url: "login",
    // urlRoot: "/",
    initialize:  function() {
      this.on("change", this.log);
    },

    log: function() {
      app.log(this.toJSON());
    },

    login: function() {
      var user = this;
      $.ajax({
        url: '/login',
        type: 'POST',
        data: user.toJSON(),
        success: function(data, textStatus, xhr) {
          user.set("state", "logined");
        },
        error: function(xhr, textStatus, errorThrown) {
          app.log(xhr);
        }
      });
    }
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
      this.listenTo(this.model, "change", this.render);
    },

    login: function(e) {
      e.preventDefault();
      this.model.set({
        "email": this.$el.find("[name='email']").val(),
        "password": this.$el.find("[name='password']").val(),
      });
      // this.model.save({success: function(resp) {
      //   app.log(resp);
      // }});
      this.model.login();
    },

    serialize: function() {
      return this.model.toJSON();
    }

  });

  // Return the module for AMD compliance.
  return User;

});
