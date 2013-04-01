// List module
define([
  // Application.
  "app"
],

// Map dependencies from above array.
function(app) {

  // Create a new module.
  var List = app.module();

  // Default Model.
  List.Model = Backbone.Model.extend({
    defaults:{
        title: "",//String,
        description: "",//String,
        creationDate: "",//{type: Date, default: Date.now},
        startDate: "",//{type: Date, default: Date.now},
        priority: "",//Number,
        state: "",//Boolean   // Active
        type: "" //Event or Task
    },
    initialize: function(item) {
      //if model haven't id, then save it to server
      if (this.isNew())
        this.save(item, {wait: true});
    },
    //binding id for better backbone integration
    parse: function(resp) {
      resp.id = resp._id;
      return resp;
    }
  });

  // Default Collection.
  List.Collection = Backbone.Collection.extend({
    model: List.Model,
    url: "/list"
  });

  // Default View.
  List.Views.Layout = Backbone.Layout.extend({
    template: "list/layout",
    tagName: "div",
    className: "main-block",

    events: {
      "click #send-item": "add"
    },

    initialize: function() {
      this.listenTo(this.collection, "add reset", this.render);
    },

    //adding new list item to collection
    add: function(e) {
      e.preventDefault();

      this.collection.add({
        "title": this.$el.find("[name='title']").val(),
        "description": this.$el.find("[name='description']").val(),
        "priority": this.$el.find("[name='priority']").val(),
        "type": this.$el.find("[name='type']:checked").val()
      });
    },

    //rendering item notes subview
    beforeRender: function() {
      this.collection.each(function(item) {
        this.insertView("ul", new List.Views.Item({
          model: item
        }));
      },this);
    }
  });

  //teaser preview view of notes
  List.Views.Item = Backbone.View.extend({
    template: "list/item",
    tagName: "li",

    events: {
      "click .js-delete": "delete",
      "click .js-save": "update",
      "click .ct-item": "edit"
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },

    //inline editing
    edit: function(e) {
      var $edit = $(e.currentTarget),
          self = this;

      $edit.attr("contenteditable", "true").addClass("edit");

      this.$el.find(".js-save").show();

      $(document).on("click", function(evt) {
        if (evt.target !== e.target) {
          self.update(evt);
        };
      });
    },

    //update list changes
    update: function(e) {
      e.preventDefault();
      var $text = this.$el.find(".ct-item");

      if (this.model.get("text") != $.trim($text.text()))
        this.model.save({
          "text": $.trim($text.text())
        }, {patch: true});

      $(".ct-item").removeAttr("contenteditable").removeClass("edit");

      $(".js-save").hide();

      $(document).off();
    },

    //deleting model from collection and server + deleting view
    delete: function(e) {
      e.preventDefault();

      this.model.destroy();
      this.remove();
    },

    serialize: function() {
      return this.model.toJSON();
    }
  });

  //full notes view with editing
  List.Views.Edit = Backbone.View.extend({
    template: "list/edit",
    tagName: "form",
    className: "form-horizontal",

    events: {
      "click #update-list": "updateNote",
      "click .js-delete": "delNote"
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },

    updateNote: function(e) {
      e.preventDefault();

      this.model.save({
        "text": this.$el.find("[name='text']").val()
      }, {patch: true, processData: true});
    },

    //deleting model from collection and server + deleting view + redirect to view all notes
    delNote: function(e) {
      e.preventDefault();

      this.model.destroy();
      this.remove();

      app.router.navigate("/main", {trigger: true});
    },

    serialize: function() {
      return this.model.toJSON();
    }
  });

  // Return the module for AMD compliance.
  return List;

});