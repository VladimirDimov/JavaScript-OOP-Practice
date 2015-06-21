var ShapesFactory = (function(){
  var Shape = (function(){
    function Shape(width, height){
      if (isValidDimension(width)) {
        this.width = width;
      }else {
          throw Error('Invalid width!');
      }

      if (isValidDimension(height)) {
        this.height = height;
      }else {
        throw Error('Invalid height');
      }
    }

    Shape.prototype.calculateSurface = function(){
      throw Error('Not implemented virtual method!');
    };

    function isValidDimension(dim){
      if (dim <= 0) {
        return false;
      }

      return true;
    }

    return Shape;
  }());

  var Rectangle = (function(){
    function Rectangle(width, height){
      Shape.call(this, width, height);
    }

    Rectangle.prototype = new Shape();
    Rectangle.prototype.constructor = Rectangle;

    Rectangle.prototype.calculateSurface = function(){
      return this.width*this.height;
    };

    return Rectangle;
  }());

  var Triangle = (function(){
    function Triangle(width, height){
      Shape.call(this, width, height);
    }

    Triangle.prototype = Object.create(Shape.prototype);
    Triangle.prototype.constructor = Triangle;
    Triangle.prototype.calculateSurface = function(){
      return this.width * this.height / 2;
    };

    return Triangle;
  }());

  var Square = (function(){
    function Square(side){
      Shape.call(this, side, side);
    }

    Square.prototype = new Shape();
    Square.prototype.constructor = Square;
    Square.prototype.calculateSurface = function(){
      return this.width * this.height;
    };

    return Square;
  }());

  return {
    Rectangle: Rectangle,
    Triangle: Triangle,
    Square: Square
  };
}());

var rectangle1 = new ShapesFactory.Rectangle(5,5);
console.log(rectangle1.calculateSurface());

var triangle = new ShapesFactory.Triangle(3,4);
console.log(triangle.calculateSurface());

var square = new ShapesFactory.Square(7);
console.log(square.calculateSurface());

debugger;
