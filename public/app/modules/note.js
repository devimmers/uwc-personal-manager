// Note module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Note = app.module();

  // Default Model.
  Note.Model = Backbone.Model.extend({
    defaults:{
      title: "",//String,
      description: "",//String,
      creationDate: ""
    },
    initialize: function(item) {
      if (this.isNew())
        this.save(item, {wait: true});
    }//,
    // url: "/notes"
  });

  // Default Collection.
  Note.Collection = Backbone.Collection.extend({
    model: Note.Model,
    url: "/notes",

    parse: function(resp) {
      _(resp).map( function( value, key, resp ) {
        value.id = value._id;
        return value;
      });
      return resp;
    }
  });

  // Default View.
  Note.Views.Layout = Backbone.Layout.extend({
    template: "note/layout",
    tagName: "ul",

    events: {
      "click #send-note": "addNote"

    },

    initialize: function() {
      this.listenTo(this.collection, "add reset", this.render);
    },

    addNote: function(e) {
      e.preventDefault();

      this.collection.add({
        "title": this.$el.find("[name='title']").val(),
        "description": this.$el.find("[name='description']").val()
      });
    },


    beforeRender: function() {
      this.collection.each(function(item) {
        this.insertView( new Note.Views.Item({
          model: item
        }));
      },this);
    }
  });

  Note.Views.Item = Backbone.View.extend({
    template: "note/item",
    tagName: "li",

    events: {
      "click .js-delete": "delNote"
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },

    delNote: function(e) {
      e.preventDefault();

      this.model.destroy();
      this.remove();
    },

    serialize: function() {
      return this.model.toJSON();
    }
  });

  Note.Views.Edit = Backbone.View.extend({
    template: "note/edit",
    tagName: "form",
    className: "form-horizontal",

    events: {
      "click #update-note": "updateNote",
      "click .js-delete": "delNote"
    },

    updateNote: function(e) {
      e.preventDefault();

      this.model.save({
        "title": this.$el.find("[name='title']").val(),
        "description": this.$el.find("[name='description']").val()
      }, {patch: true});
    },

    delNote: function(e) {
      e.preventDefault();

      this.model.destroy();
      this.remove();

      app.router.navigate("/usernotes", {trigger: true});
    },

    serialize: function() {
      return this.model.toJSON();
    }
  });

  // Return the module for AMD compliance.
  return Note;

});
