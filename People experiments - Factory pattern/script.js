var Human = (function() {
	var Human = {
		init: function(firstName, lastName, age) {
			this.firstName = firstName;
			this.lastName = lastName;
			this.age = age;
			return this;
		},
		sayHi: function() {
			return 'Hello! My name is ' + this.firstName;
		},
		get fullName() {
			return this.firstName + ' ' + this.lastName
		},
		set fullName(name) {
			setFullName.call(this, name);
		}
	};

	Object.defineProperty(Human, 'prop', {
		get: function(){
			return this.prop1;
		},
		set: function(value){
			this.prop1 = value;
		},
		sealed: false
	});

	function setFullName(name) {
		name = name.split(/\s+/);
		this.firstName = name[0];
		this.lastName = name[1];
	}

	return Human;
}());

var Student = (function(parent) {
	var Student = {
		init: function(firstName, lastName, age, grade) {
			var obj = Object.create(parent).init(firstName, lastName, age);
			obj.grade = grade;
			return obj;
		}
	}

	return Student;
}(Human));

var pesho = Object.create(Human)
	.init('Petar', 'Petrov', 25);

	pesho.prop1 = 'BBB';

var gosho = Object.create(Student)
	.init('Georgi', 'Georgiev', 11, 5);
console.log(gosho.fullName);

gosho.fullName = 'Georeto Goshev';
console.log(gosho.fullName);

gosho.prop1 = "AAA";
gosho.prop1 = "CCC";

var func = Human;



debugger;