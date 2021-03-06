var Human = (function() {

	function Human(firstname, lastname) {
		this.firstname = firstname;
		this.lastname = lastname;
	}

	Human.prototype.toString = function() {
		return '[' + this.firstname + ' ' + this.lastname + ']';
	}

	Object.defineProperty(Human, 'hairColor', {
		get: function(){
			return this.hairColor;
		},
		set: function(value){
			this.hairColor = value;
		}
	})

	return {
		get: function(firstname, lastname){
			Object.create(Human).init(firstname,lastname);
		}
	};
}());

var Student = (function() {
	function Student(firstname, lastname, grade) {
		Human.call(this, firstname, lastname);
		this.grade = grade;
	}

	Student.prototype = Object.create(Human.prototype);
	Student.prototype.constructor = Student;
	Student.prototype.toString = function() {
		return Human.prototype.toString.call(this) + ' Grade: ' + this.grade;
	}

	return Student;
}());

var gosho = new Human('georgi', 'georgiev');
console.log(gosho.toString());
console.log(gosho instanceof(Human));
console.log(gosho instanceof(Student));

var pesho = new Student('Petar', 'Petrov', 7);
console.log(pesho.toString());
console.log(pesho instanceof(Human));
console.log(pesho.constructor === Student);
pesho.hairColor = 'red';
console.log(pesho.hairColor);
console.log(pesho.isPrototypeOf(Human));
debugger;



