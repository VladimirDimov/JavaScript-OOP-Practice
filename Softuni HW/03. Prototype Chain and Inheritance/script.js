// Problem 1.	2D Geometry Structure – Pseudo-Classical Model
function task1() {
	var Shape = (function() {
		function Shape(x, y, color) {
			this.X = x;
			this.Y = y;
			this.Color = color;
		}

		Shape.prototype.toString = function() {
			return 'X: ' + this.X + ', Y: ' + this.Y + ', Color: ' + this.Color;
		}

		return Shape;
	}());

	var Circle = (function() {
		function Circle(x, y, color, radius) {
			Shape.call(this, x, y, color)
			this.Radius = radius;
		}

		Circle.prototype = Object.create(Shape.prototype);
		Circle.prototype.toString = function() {
			return Shape.prototype.toString.call(this) + ', Radius: ' + this.Radius;
		}
		return Circle;
	}());

	var Rectangle = (function() {
		function Rectangle(x, y, color, width, height) {
			Shape.call(this, x, y, color);
			this.Width = width;
			this.Height = height;
		}

		Rectangle.prototype = Object.create(Shape.prototype);
		Rectangle.prototype.toString = function() {
			return Shape.prototype.toString.call(this) + ', Width: ' + this.Width + ', Height: ' + this.Height;
		}
		return Rectangle;
	}());

	var c = new Circle(1, 5, 'red', 6);
	var rect = new Rectangle(0, 5, 'green', 4, 2);
	console.log('Circle: ' + c.toString());
	console.log('Rectangle: ' + rect.toString());

	debugger;
}

function task1WithPoints() {
	var Point = (function() {
		function Point(x, y, name) {
			this.x = x;
			this.y = y;
			this.Name = name || '';
		}

		Point.prototype.toString = function() {
			return '[Point-' + this.Name + ' X=' + this.x + ' Y=' + this.y + ']';
		}

		return Point;
	}());

	var Shape = (function() {
		function Shape(center, color) {
			this.Center = center;
			this.Center.Name = this.Center.Name || 'Center';
			this.Color = color;
		}

		Shape.prototype.toString = function() {
			return this.Center.toString() + ' Color=' + this.Color;
		}

		return Shape;
	}());

	var Triangle = (function() {
		function Triangle(p1, p2, p3) {
			this.P1 = p1;
			this.P2 = p2;
			this.P3 = p3;
		}

		Triangle.prototype.toString = function() {
			return this.P1.toString() + ' ' + this.P2.toString() + ' ' + this.P3.toString();
		}

		return Triangle;
	}());

	var point1 = new Point(3, 4);
	console.log(point1.toString());

	var shape1 = new Shape(new Point(2, 5), 'orange');
	console.log(shape1.toString());

	var traingle1 = new Triangle(new Point(1, 1, 'A'), new Point(2, 2, 'B'), new Point(2, 3, 'C'));
	console.log(traingle1.toString());

	debugger;

	
}

task1WithPoints();