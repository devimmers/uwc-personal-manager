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
      creationDate: "", //auto field
      href: ""
    },
    initialize: function(item) {
      //if model haven't id, then save it to server
      if (this.isNew())
        this.save(item, {wait: true});
    },
    //binding id for beter backbone intergation
    parse: function(resp) {
      resp.href = resp.id = resp._id;
      return resp;
    }
  });

  // Default Collection.
  Note.Collection = Backbone.Collection.extend({
    model: Note.Model,
    url: "/notes"
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

    //adding new note to collection
    addNote: function(e) {
      e.preventDefault();

      this.collection.add({
        "title": this.$el.find("[name='title']").val(),
        "description": this.$el.find("[name='description']").val()
      });
    },

    //rendering item notes subview
    beforeRender: function() {
      this.collection.each(function(item) {
        this.insertView( new Note.Views.Item({
          model: item
        }));
      },this);
    }
  });

  //teaser preview view of notes
  Note.Views.Item = Backbone.View.extend({
    template: "note/item",
    tagName: "li",

    events: {
      "click .js-delete": "delNote"
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },

    //deleting model from collection and server + deleting view
    delNote: function(e) {
      e.preventDefault();

      this.model.destroy();
      this.remove();
    },

    serialize: function() {
      return this.model.toJSON();
    }
  });

  //full notes view with editing
  Note.Views.Edit = Backbone.View.extend({
    template: "note/edit",
    tagName: "form",
    className: "form-horizontal",

    events: {
      "click #update-note": "updateNote",
      "click .js-delete": "delNote"
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },

    updateNote: function(e) {
      e.preventDefault();

      this.model.save({
        "title": this.$el.find("[name='title']").val(),
        "description": this.$el.find("[name='description']").val()
      }, {patch: true, processData: true});
    },

    //deleting model from collection and server + deleting view + redirect to view all notes
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