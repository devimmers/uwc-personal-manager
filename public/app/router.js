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
      "usernotes/:id": "editNotes",
      "logout": "logout"
    },

    initialize: function() {
      var entity = {
        user: new User.Model,
        notes: new Note.Collection
      };

      _(this).extend(entity);

      this.session = $.when(this.user.fetch());
    },


    checkAuth: function(callback) {
      var self = this;
      this.session.done(function() {
        if (self.user.get("token") != "")
          return callback();
        else
          return self.navigate("/", {trigger: true});
      });
    },

    preLoad: function(collection, callback) {
      var self = this;
      $.when(collection.fetch()).done(function() {
        return callback();
      });
    },

    index: function() {
      var self = this,
          main = app.useLayout(main);

      main.setView(
        new User.Views.Login({
          model: this.user
        })
      ).render();

      this.session.done(function() {
        if (self.user.get("token") != ""){
          main.insertViews(
            [new Note.Views.Layout({
                collection: self.notes
              })
            ]
          );
          self.notes.fetch();
        }
      });
    },

    notes: function() {
      var self = this;
      this.checkAuth(function(){
        self.preLoad(self.notes, function() {
          app.useLayout(main).setView(
            new Note.Views.Layout({
              collection: self.notes
            })
          ).render();
        });
      });
    },

    editNotes: function(id) {
      var self = this;
      this.checkAuth(function() {
        self.preLoad(self.notes, function() {
          app.useLayout(main).setView(
            new Note.Views.Edit({
              model: self.notes.get(id)
            })
          ).render();
        });
      });
    },

    logout: function() {
      this.user.destroy();
      //this.navigate("/", {trigger: true});
    }


  });

  return Router;

});
