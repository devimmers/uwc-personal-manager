// Wine module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var Wine = app.module();

  // Default Model.
  Wine.Model = Backbone.Model.extend({
    defaults:{
      name: '',//String,
      year: '',//String,
      price: '',//Number,
      description: '',//String,
      picture: ''//String
    }
  });

  // Default Collection.
  Wine.Collection = Backbone.Collection.extend({
    model: Wine.Model,
    url: '/items'
  });

  // Default View.
  Wine.Views.Layout = Backbone.Layout.extend({
    template: "wine",

    initialize: function() {
      this.listenTo(this.collection, 'change reset', this.render);
      this.collection.fetch();
    },

    beforeRender: function() {
      this.collection.each(function(item) {
        this.insertView("div", new Wine.Views.Teaser({
          model: item
        }));
      }, this)
    }
  });

  Wine.Views.Teaser = Backbone.Layout.extend({
    template: "wine-teaser",
    className: "item-teaser span3",

    serialize: function() {
      return this.model.toJSON();
    }
  });

  // Return the module for AMD compliance.
  return Wine;

});
