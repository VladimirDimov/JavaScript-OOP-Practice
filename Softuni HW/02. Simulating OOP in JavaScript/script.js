var Person = (function(){
	var instance;
	function person(firstName, lastName){
		this.firstName = firstName;
		this.lastName = lastName;
		instance = this;
	}

	Object.defineProperty(person.prototype, 'fullName', {
		get: function () {
			return this.firstName + ' ' + this.lastName;
		},
		set: function(name){
			this.firstName = name.split(' ')[0];
			this.lastName = name.split(' ')[1];
		}
	});

	return person;
}());

var pesho = new Person('P', 'P');
console.log(pesho.fullName);
pesho.firstName = 'Petar';
pesho.lastName = 'Petrov';
console.log(pesho.fullName);

pesho.fullName = 'Georgi Georgiev';
console.log(pesho.firstName);
console.log(pesho.lastName);

debugger;
