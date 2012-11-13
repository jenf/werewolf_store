
									$(document).ready(function(){
						var types=["Unknown", "Human","Werewolf","Healer","Little girl","Gravedigger", "Hunter","Cupid","Thief","Sheriff","Witch"];
						var Player = Backbone.Model.extend({
										defaults: {
										name: 'Unknown',
										state: types[1]
										}
						});

						var PlayerView = Backbone.View.extend({
						tagName: 'li',
						template: _.template($('#player-template').html()),
						events: {
						'click .remove':'remove',
						'dblclick .name':'editName',
					  "keypress .edit"  : "updateOnEnter",
						'blur .editing':'save'
							},
							initialize: function(){
								_.bindAll(this, 'render', 'unrender');
								this.model.bind('change', this.render);
								this.model.bind('remove', this.unrender);
							},
							render: function(){
								$(this.el).html(this.template(this.model.toJSON()));
								return this;
							},
							unrender: function() {
								$(this.el).remove();
							},
							remove: function(){
								alert(this.model.get('name'));
								this.model.destroy();
								},
							editName: function() {
								var item = $(this.el).find(".name");
								item.addClass("editing");
								item.find("input").focus();
								this.editing="name";

								},
   						updateOnEnter: function(e) {
					      if (e.keyCode == 13) this.save();
					    },
										
							save: function() {
								if (this.editing == "name")
								{
									var item = $(this.el).find(".name");
									var value = item.find("input").val()
									if (value)
									{
										this.model.set({name: value});
										this.model.save();
									}
									item.removeClass("editing");
								}
							}
							
						});

						var List = Backbone.Collection.extend({
							model: Player,
							localStorage: new Backbone.LocalStorage('game')
						});
						var GameView = Backbone.View.extend({
										el: $("body"),
										events: {
														'click button#add':'addItem'
										},
										initialize: function() {
														_.bindAll(this, 'render','addItem','appendItem');
														this.collection = new List();
														this.collection.bind('add', this.appendItem);
														this.collection.fetch()
														this.render();
										},
										render: function(){
											var self = this;
											$(this.el).append("<button id='add'>Add player</button>");
											$(this.el).append("<ul id='players'></ul>");	
											_(this.collection.models).each(function(item){
												self.appendItem(item);
											}, this);
										},
										addItem: function() {
											this.counter++;
											var player = new Player()
											player.set({
											name: "unnamed"
											});
											this.collection.create(player);
										},
										appendItem:function(player){
											var playerView = new PlayerView({
												model: player
											});

											$('ul#players').append(playerView.render().el);

										}
						});
;
							gameview = new GameView();
});

