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
		get: function() {
			return this.prop1;
		},
		set: function(value) {
			this.prop1 = value;
		},
		sealed: false
	});

	function setFullName(name) {
		name = name.split(/\s+/);
		this.firstName = name[0];
		this.lastName = name[1];
	}

	return {
		get: function(firstName, lastName, age){
			return Object.create(Human).init(firstName, lastName, age);
		}
	};
}());

var Student = (function(parent) {
	var Student = Object.create(parent);
	Object.defineProperties(Student, {
		init: {
			value: function(firstName, lastName, age, grade) {
				parent.init.call(this, firstName, lastName, age);
				this.grade = grade;
				return this;
			}
		},
		grade: {
			set: function(value) {
				this._grade = value;
			},
			get: function() {
				value: return this._grade;
			}
		}
	});

	return Student;
}(Human));

var pesho = Human.get('Petar', 'Petrov', 25);

pesho.prop1 = 'BBB';

var gosho = Object.create(Student)
	.init('Georgi', 'Georgiev', 11, 5);
console.log(gosho.fullName);

gosho.fullName = 'Georeto Goshev';
console.log(gosho.firstName + ' ' + gosho.lastName);

console.log('Is gosho Human?  ' + Human.isPrototypeOf(gosho));

var func = Human;


var A = {};
var B = Object.create(A);
var C = Object.create(B);


var a1 = A.isPrototypeOf(C) // true
var a2 = B.isPrototypeOf(C) // true
var a3 = Array.prototype.isPrototypeOf(C) // false

debugger;