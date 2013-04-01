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
        priority: "3",//Number,
        state: "true",//Boolean   // Active
        type: "event" //Event or Task
    },

    url: function() {
      var id = this.id || "";
      if (!_(id).isEmpty())
        id = "/" + id;
      return "/list/" + this.get("type") + id;
    },
    initialize: function(item, ops) {
      //if model haven't id, then save it to server
      app.log(this);
      if (this.isNew() && !ops.wait)
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
    url: "/list",

    initialize: function() {
    },
    comparator: function(ab) {
          if(this._order_by == 'startDate')
              return ab.get('startDate');
          else if(this._order_by == 'priority')
              return -ab.get('priority');
          else
              return this._order_by == 'startDate'
                  ? ab.get('startDate')
                  : -ab.get('priority');
      },
    order_by_date: function() {
          this._order_by = 'startDate';
          this.sort();
    },
    order_by_priority: function() {
          this._order_by = 'priority';
          this.sort();
    },
    _order_by: 'startDate'

  });



  // Default View.
  List.Views.Layout = Backbone.Layout.extend({
    template:   "list/layout",
    tagName:    "div",
    className:  "main-block",

    events: {
      "click #add-item":        "add",
      "click #data-sort":       "dataSort",
      "click #priority-sort":   "prioritySort"
    },

    initialize: function() {
      this.listenTo(this.collection, "add reset sort", this.render);
    },

    add: function(e) {
      e.preventDefault();

      this.setView("#edit-item", new List.Views.Edit({
        model: new List.Model({},{"wait":true}),
        collection: this.collection
      })).render();
    },

    dataSort: function(e) {
        e.preventDefault();
        this._order_by = "startDate";
        this.collection.order_by_date();
        // this.render();
    },

    prioritySort: function(e) {
        e.preventDefault();
        this._order_by = "priority";
        this.collection.order_by_priority();
        // this.render();
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
      "click .js-edit": "edit"
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

    events: {
      "click #send-item":       "add",
      "click #update-list": "updateNote",
      "click .js-delete": "delNote"
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
    },

    //adding new list item to collection
    add: function(e) {
      e.preventDefault();

      //app.log(this.model.toJSON());

      this.model.set({
        "title": this.$el.find("[name='title']").val(),
        "description": this.$el.find("[name='description']").val(),
        "priority": this.$el.find("[name='priority']").val(),
        "type": this.$el.find("[name='type']:checked").val(),
        "state": this.$el.find("[name='state']").is(":checked")
      }, {patch: true});

      if (!_(this.collection).isUndefined())
        this.collection.add(this.model);

      app.log(this.model);
      this.remove();
    },

    //deleting model from collection and server + deleting view + redirect to view all notes
    delete: function(e) {
      e.preventDefault();

      this.model.destroy();
      this.remove();

    },

    serialize: function() {
      return this.model.toJSON();
    }
  });

  // Return the module for AMD compliance.
  return List;

});