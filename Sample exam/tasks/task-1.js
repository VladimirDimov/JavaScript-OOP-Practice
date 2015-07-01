function solve() {
  var _playlists = [],
    _audioplayers = [],
    currentId = 1;

  var Playlist = (function() {
    var Playlist = function(name) {
      this.name = name;
      this._audios = [];
    }

    Playlist.prototype.addAudio = function(audio) {
      this._audios.push(audio);
    };

    Playlist.prototype.getAudioById = function(id) {
      var audioIndex = 0;
      if (this._audios.find(function(element, index) {
          audioIndex = index;
          return element.id === id;
        })) {
        return this._audios[audioIndex];
      } else {
        return null;
      }
    };

    Playlist.prototype.removeAudioById = function(id) {
      var len = this._audios.length;
      for (var i = 0; i < len; i++) {
        if (this._audios[i].id === id) {
          this._audios.splice(i, 1);
          return;
        };
      };
    };

    Playlist.prototype.getIdByAudioName = function(name) {
      var len = this._audios.length;
      for (var i = 0; i < len; i++) {
        if (this._audios[i].name === name) {
          return this._audios[i].id;
        };
      }

      return generateId();
    }

    function generateId() {
      var newId = currentId + 1;
      currentId += 1;
      return newId;
    }

    return Playlist;
  }());

  var Audio = (function() {
    var Audio = function(name, id) {
      this.name = name;
      this.id = id;
    };

    return Audio;
  }());
}

module.exports = solve;