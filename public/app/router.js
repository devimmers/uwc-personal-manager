define([
  // Application.
  "app",
  "modules/user",
  "modules/note"
],

function(app, User, Note) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "login": "index",
      "usernotes": "notes",
      "usernotes/:id": "editNotes"
    },

    initialize: function() {
      var entity = {
        user: new User.Model,
        notes: new Note.Collection
      };

      _(this).extend(entity);

    },

    checkAuth: function() {
      if (this.user.get("token") != "")
        return true;
    },

    index: function() {
      app.useLayout(main).setView(
        new User.Views.Login({
          model: this.user
        })
      ).render();
    },

    notes: function() {
      if (this.checkAuth()) {
        app.useLayout(main).setView(
          new Note.Views.Layout({
            collection: this.notes
          })
        ).render();
        this.notes.fetch();
      } else {
        this.navigate("/", {trigger: true});
      }
    },

    editNotes: function(id) {
      if (this.checkAuth()) {
        app.useLayout(main).setView(
          new Note.Views.Edit({
            model: this.notes.get(id)
          })
        ).render();
      } else {
        this.navigate("/", {trigger: true});
      }
    }


  });

  return Router;

});
