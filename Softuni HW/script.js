var Person = (function() {
	function Person() {
		var _name;

		Object.defineProperty(Person.prototype, 'Name', {
			get: function() {
				return this._name;
			},
			set: function(value) {
				if (value.length < 3) {
					throw Error('Too short');
				};

				this._name = value;
			}
		});
	}
	return Person;
}());
var pesho = new Person();
console.log(pesho.Name);
pesho.Name = 'Petar';
console.log(pesho.Name);