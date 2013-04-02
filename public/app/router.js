define([
  // Application.
  "app",
  "modules/user",
  "modules/note",
  "modules/list"
],

function(app, User, Note, List) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "main": "main"
    },

    initialize: function() {
      var entity = {
        user: new User.Model,
        notes: new Note.Collection,
        list: new List.Collection
      };

      _(this).extend(entity);

      this.session = $.when(this.user.fetch());

      // this.listenTo(app, "enter", function() {app.log("enter!");});
      this.listenTo(app, "enter", this.auth);


      this.main = app.useLayout(main);

      this.main.setView(
        new User.Views.Login({
          model: this.user
        })
      ).render();
    },

    auth: function() {
      var self = this;
      this.session.done(function() {
        if (self.user.get("token") != "")
          self.navigate("/main", {trigger: true});
        else {
          self.notes.reset();
          self.list.reset();
          self.navigate("/", {trigger: true});
        }
      });
    },

    index: function() {
      var self = this;

      this.main.setView(
        new User.Views.Login({
          model: this.user
        })
      ).render();

      this.session.done(function() {
        if (self.user.get("token") != "")
          self.navigate("/main", {trigger: true});
      });
    },

    main: function() {
      var self = this;

      this.session.done(function() {
        if (self.user.get("token") == "")
          self.navigate("/", {trigger: true});
      });

      this.session.done(function() {
        // app.log(self.user.get("token"));
        if (self.user.get("token") != ""){
          self.main.insertViews({
            "#main-block":[new List.Views.Layout({
                collection: self.list
              }),
            new Note.Views.Layout({
                collection: self.notes
              })
            ]}
          ).render();
          self.list.fetch();
          self.notes.fetch();
        }
      });
    }


  });

  return Router;

});
