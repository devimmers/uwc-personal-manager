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
    idAtrribute: "_id",
    defaults:{
      title: "",//String,
      description: ""//String,
    },
    initialize: function() {
      if (this.isNew())
        this.save()
    },
    url: "/notes"
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

    serialize: function() {
      return this.model.toJSON();
    }
  });

  // Return the module for AMD compliance.
  return Note;

});
