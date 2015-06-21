var AnimalCherarhy = (function(){
  var Animal = (function(){
    function Animal(name, age, sex){
      if (this.constructor === Animal) {
        throw Error('Not allowed abstract class instanciation');
      }
      if (isValidName) {
        this.name = name;
      }else {
        throw Error('Invalid name format!');
      }

      if (isValidAge(age)) {
        this.age = age;
      }else {
        throw Error('Invalid age');
      }

      if (isValidSex(sex)) {
        this.sex = sex;
      }else {
        throw Error('Invalid sex ("male" or "female")');
      }
    }

    Animal.prototype.Introduce = function(){
      return 'Hello, I am your pet. I am ' + this.age + ' years old ' + this.sex + '.';
    };

    Animal.prototype.MakeSound = function(){
      if (this.constructor !== Animal) {
        throw Error('Not implemented abstract method');
      }
    };

  function isValidName(name){
    if (!(/[A-Z]{1}[a-z]{1,20}/.test(name))) {
      return false;
    }

    return true;
  }

  function isValidAge(age){
    if (age<0 || age > 150) {
      return false;
    }

    return true;
  }

  function isValidSex(sex){
    if (sex === 'male' || sex === 'female') {
      return true;
    }

    return false;
  }

  return Animal;
  }());

  var Dog = (function(){
    function Dog(name, age, sex){
      Animal.call(this, name, age, sex);
    }

    Dog.prototype = Object.create(Animal.prototype);
    Dog.prototype.constructor = Dog;
    Dog.prototype.Introduce = function(){
      return Animal.prototype.Introduce.call(this) + ' I am a dog.';
    };
    Dog.prototype.MakeSound = function () {
      return this.name + ' says "Waff-waff-waff"';
    };
    extendToSoundable(Dog.prototype);

    return Dog;
  }());

function extendToSoundable(obj){
  obj.MakeSoundInterface = function(){
      throw Error('Not implemented abstract function');
  };
}

  return {
    Animal: Animal,
    Dog: Dog
  };
}());



// var myAnimal = new AnimalCherarhy.Animal('Chocho', 3, 'male');
var Barky = new AnimalCherarhy.Dog('Barky', 5, 'male');
console.log(Barky.Introduce());
console.log(Barky.MakeSound());
console.log(Barky.MakeSoundInterface());

debugger;
