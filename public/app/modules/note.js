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
  
  });

  // Default Collection.
  Note.Collection = Backbone.Collection.extend({
    model: Note.Model
  });

  // Default View.
  Note.Views.Layout = Backbone.Layout.extend({
    template: "note/layout",
    tagName: "ul",

    initialize: function() {
      this.listenTo(this.collection, "change reset", this.render);
    },

    beforeRender: function() {
      this.collection.each(function(item) {
        this.insertView("li", new Note.Views.Item({
          model: item
        }));
      },this);
    }
  });

  Note.Views.Item = Backbone.View.extend({
    template: "note/item",

    serialize: function() {
      return this.model.toJSON();
    }
  });

  // Return the module for AMD compliance.
  return Note;

});
