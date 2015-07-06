function solve() {
	var Validators = {
		validateNonEmptyString: function(value) {
			if (typeof(value) != 'string' || value === '') {
				throw new Error('Invalid string value');
			}
		}
	};

	var Player = (function() {
		var Player = {
			init: function(name) {
				this.name = name;
				this.playlists = [];

				return this;
			},
			set name(value) {
				Validators.validateNonEmptyString(value);
				this._name = value;
			},
			get name() {
				return this._name;
			},
			getPlaylistById: function(id) {
				// TODO;
			},
			removePlaylistById: function(id) {
				// TODO;
			},
			listPlaylists: function(page, size) {
				// TODO;
			}
		};

		return {
			get: function(name) {
				return Object.create(Player).init(name);
			}
		};
	})();

	var Playlist = (function() {
		var Playlist = {
			init: function(name, id) {
				this.name = name;
				this.id = id;
				this.audios = [];
				this.videos = [];

				return this;
			},
			addAudio: function(audio) {
				/*
				Adds a audio to the PlayList
				The same audio can be added multiple times
				If the audio is firstly added to any PlayList, an id is generated for it
				If the audio is previously added to any PlayList, its id is reused
				Enables chaining
				*/
			},
			getAudioById: function(id) {
				/*
				Returns the audio that has the provided id
				Returns null, if no audio is found with the provided id
				*/
			},
			removeAudioById: function(id) {
				// TODO;
			}
		};

		return {
			get: function(name) {
				return Object.create(Playlist)
					.init(name);
			}
		};
	})();

	var Playable = (function() {
		'use strict';

		var Playable = {
			init: function(id, title, author) {
				this.id = id;
				this.title = title;
				this.author = author;

				return this;
			},
			play: function() {
				// returns a string in the format: [id]. [title] - [author]
				return this.id + '. ' + this.title + ' - ' + this.author;
			}
		};

		return Playable;
	}());

	var Audio = (function(parent) {
		var Audio = Object.create(Playable, {
			init: {
				value: function(id, title, author, length) {
					parent.init.call(this, id, title, author);
					this.length = length;

					return this;
				}
			},
			length: {
				set: function(value) {
					this._length = value;
				},
				get: function() {
					return this._length;
				}
			},
			play: {
				value: function() {
					// reuses the play() form Playable and adds: - [length] at the end
					return parent.play.call(this) + ' - ' + this.length;
				}
			}
		});

		return {
			get: function(id, title, author, length) {
				Object.create(Audio)
					.init(id, title, author, length);
			}
		};
	})(Playable);

	var Video = (function(parent) {
		var Video = Object.create(Audio, {
			init: {
				value: function(id, title, author, imdbRating) {
					parent.init.call(this, id, title, author);
					this.imdbRating = imdbRating;

					return this;
				}
			},
			imdbRating: {
				set: function(value) {
					this._imdbRating = value;
				},
				get: function() {
					return this._imdbRating;
				}
			},
			play: {
				value: function() {
					// reuses the play() form Playable and adds: - [imdbRating] at the end
					return parent.play.call(this) + ' - ' + this.imdbRating;
				}
			}
		});

		return {
			get: function(id, title, author, imdbRating) {
				return Object.create(Video)
					.init(id, title, author, imdbRating);
			}
		};
	})(Playable);

	debugger;
	var movie1 = Video.get(1, 'TITLE ', 'AUTHOR ', 10);
	console.log(movie1.play());
	debugger;
}

solve();