var Human = (function(){

   function Human(firstname, lastname){
     this.firstname = firstname;
     this.lastname = lastname;
   }

   Human.prototype = {
     constructor: Human,
     toString: function(){
       return '[' + this.firstname + ' ' + this.lastname + ']';
     }
   }

   return Human;
}());

var  Student = (function(){
  function Student(firstname, lastname, grade){
    Human.call(this, firstname, lastname);
    this.grade = grade;
  }

  Student.prototype = new Human();
  Student.prototype.constructor = Student;
  Student.prototype.toString = function(){
    return Human.prototype.toString.call(this) + ' Grade: ' + this.grade;
  }

  return Student;
}());

var Worker = (function(){
  function Worker(firstname, lastname, weekSalary, workHoursPerDay){
    Human.call(this, firstname, lastname);
    this.weekSalary = weekSalary;
    this.workHoursPerDay = workHoursPerDay;
  }

  Worker.prototype = Object.create(Human);
  Worker.prototype.moneyPerHour = function(){
      return this.weekSalary/this.workHoursPerDay;
  }
  Worker.prototype.toString = function () {
    return Human.prototype.toString.call(this) + ' Money/hour: ' + this.moneyPerHour();
  }
  return Worker;
}());

var gosho = new Human('georgi', 'georgiev');
console.log(gosho.toString());
var pesho = new Student('Petar', 'Petrov', 7);
console.log(pesho.toString());
var stamat = new Worker('Stamat', 'Barbaronov', 200, 8);
console.log(stamat.toString());

var students = [
  new Student('Aaron', 'Brymkov', 12),
  new Student('Dundi', 'Mundev', 6),
  new Student('Toncho', 'Tonev', 12),
  new Student('Boncho', 'Genchev', 7)
];

  function Sorter(array, prop){
    if (array.constructor !== Array) {
      throw Error('Invalid array input!')
    }
    if (array.length == 0) {
      throw Error('Empty array!')
    }
       if (!array.every(function(item){
      return item.hasOwnProperty(prop);
    })) {
      throw Error('Invalid array elements!');
    }

    return array.sort(function(a, b){
      return a.grade - b.grade;
    })
  }

var sortedStudents = Sorter(students, 'grade');
console.log(sortedStudents.map(function(item){return item.toString();}));
debugger;
