var Person =(function Person(){
	function Person(firstName, lastName){
		this.firstName =  firstName;
		this.lastName = lastName;
	}

	Person.prototype.name = function(){
		return this.firstName + ' ' + this.lastName;
	}

	return Person;
}());

var peter = new Person("Peter", "Jackson");
peter.firstName = 'Pesho';
console.log(peter.firstName);
console.log(peter.lastName);
console.log(peter.name());

debugger;