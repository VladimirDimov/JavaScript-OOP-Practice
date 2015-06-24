function processRestaurantManagerCommands(commands) {
	'use strict';

	var RestaurantEngine = (function() {
		var _restaurants, _recipes;

		function initialize() {
			_restaurants = {};
			_recipes = {};
		}

		var Restaurant = (function() {
			function Restaurant(name, location) {
				this._receipes = [];

				if (!name) {
					throw Error('Name cannot be null or empty');
				}
				this.name = name;

				if (!location) {
					throw Error('Location cannot be null or empty');
				}
				this.location = location;
			}

			Restaurant.prototype.printRestaurantMenu = function() {
				var result = '';
				result += '***** ' + this.name + ' - ' + this.location + ' *****' + '\n';
				if (this._receipes.length == 0) {
					result += 'No recipes... yet\n';
				} else {
					var drinks = this._receipes.filter(function(item) {
						return item.constructor === Drink;
					}).sort(orderByName).map(function(item){return item.toString();});
					var salads = this._receipes.filter(function(item) {
						return item.constructor === Salad;
					}).sort(orderByName).map(function(item){return item.toString();});
					var maincourses = this._receipes.filter(function(item) {
						return item.constructor === MainCourse;
					}).sort(orderByName).map(function(item){return item.toString();});
					var desserts = this._receipes.filter(function(item) {
						return item.constructor === Dessert;
					}).sort(orderByName).map(function(item){return item.toString();});

					if (drinks.length != 0) {
						result += '~~~~~ DRINKS ~~~~~\n';
						result += drinks.join('');
					};

					if (salads.length != 0) {
						result += '~~~~~ SALADS ~~~~~\n';
						result += salads.join('');
					};

					if (maincourses.length != 0) {
						result += '~~~~~ MAIN COURSES ~~~~~\n';
						result += maincourses.join('');
					};

					if (desserts.length != 0) {
						result += '~~~~~ DESSERTS ~~~~~\n';
						result += desserts.join('');
					};

				}

				Restaurant.prototype.addRecipe = function(receipe) {
					if (this._receipes.some(function(item) {
							return item.name == receipe.name
						})) {
						throw new Error('A receipe with that name is already available.');
					};

					this._receipes.push(receipe);
				};

				return result;
			};

			Restaurant.prototype.removeRecipe = function(receipe) {
				var findIndex;

				if (!this._receipes.some(function(item, index) {
						findIndex = index;
						return item.name == receipe.name;
					})) {
					throw new Error('Unavailable receipe');
				};

				this._receipes.splice(findIndex, 1);
			};

			function orderByName(a, b) {
				if (a.name < b.name) {
					return -1;
				} else if (a.name > b.name) {
					return 1;
				} else {
					return 0;
				}
			}

			return Restaurant;
		}());

		var Receipe = (function() {
			function Receipe(name, price, calories, quantity, timeToPrepare) {
				if (!name) {
					throw Error('Name cannot be null or empty');
				}
				this.name = name;

				if (price < 0) {
					throw Error('Price must be positive');
				}
				this.price = (Math.round(price*100)/100).toFixed(2);

				if (calories < 0) {
					throw Error('Calories must be positive');
				}
				this.calories = calories;

				if (quantity < 0) {
					throw Error('Quantity must be positive');
				}
				this.quantity = quantity;

				if (timeToPrepare < 0) {
					throw Error('TimeToPrepare must be positive');
				}
				this.timeToPrepare = timeToPrepare;
			}

			Receipe.prototype.toString = function() {
				var result = '';

				result += '==  ' + this.name + ' == $' + this.price + '\n';
				result += 'Per serving: ' + this.quantity + ' ' + this.measuringUnit + ', ' +
					this.calories + ' kcal' + '\n';
				result += 'Ready in ' + this.timeToPrepare + ' minutes' + '\n';

				return result;
			};

			return Receipe;
		}());

		var Drink = (function() {
			function Drink(name, price, calories, quantity, timeToPrepare, isCarbonated) {
				if (calories > 100) {
					throw Error('The calories in a drink must not be greater than 100.');
				}

				if (timeToPrepare > 20) {
					throw Error('The time to prepare a drink must not be greater than 20 minutes.');
				}

				Receipe.call(this, name, price, calories, quantity, timeToPrepare);
				this.isCarbonated = isCarbonated;
				this.measuringUnit = 'ml';
			}

			Drink.prototype = Object.create(Receipe.prototype);
			Drink.prototype.constructor = Drink;
			Drink.prototype.toString = function() {
				var result = '';
				result += Receipe.prototype.toString.call(this);
				var carbonatedToString = this.isCarbonated ? 'yes' : 'no';
				result += 'Carbonated: ' + carbonatedToString + '\n';

				return result;
			};
			return Drink;
		}());

		var Meal = (function() {
			function Meal(name, price, calories, quantity, timeToPrepare, isVegan) {
				Receipe.call(this, name, price, calories, quantity, timeToPrepare);
				this.measuringUnit = 'g';
				this._isVegan = isVegan;
			}

			Meal.prototype = Object.create(Receipe.prototype);
			Meal.prototype.constructor = Meal;
			Meal.prototype.toString = function() {
				return (this._isVegan ? '[VEGAN] ' : '') + Receipe.prototype.toString.call(this);
			};
			Meal.prototype.toggleVegan = function() {
				this._isVegan = !(this._isVegan);
			};

			return Meal;
		}());

		var Dessert = (function() {
			function Dessert(name, price, calories, quantity, timeToPrepare, isVegan) {
				Meal.call(this, name, price, calories, quantity, timeToPrepare, isVegan);
				this._hasSugar = true;
			}

			Dessert.prototype = Object.create(Meal.prototype);
			Dessert.prototype.constructor = Dessert;

			Dessert.prototype.toString = function() {
				return (this._hasSugar ? '' : '[NO SUGAR] ') + Meal.prototype.toString.call(this);
			};

			Dessert.prototype.toggleSugar = function() {
				this._hasSugar = !(this._hasSugar);
			}

			return Dessert;
		}());

		var MainCourse = (function() {
			function MainCourse(name, price, calories, quantity, timeToPrepare, isVegan, type) {
				Meal.call(this, name, price, calories, quantity, timeToPrepare, isVegan);
				this.type = type;
			}

			MainCourse.prototype = Object.create(Meal.prototype);
			MainCourse.prototype.constructor = MainCourse;
			MainCourse.prototype.toString = function() {
				var result = '';
				result += Meal.prototype.toString.call(this);
				result += 'Type: ' + this.type + '\n';

				return result;
			};


			return MainCourse;
		}());

		var Salad = (function() {
			function Salad(name, price, calories, quantity, timeToPrepare, containsPasta) {
				Meal.call(this, name, price, calories, quantity, timeToPrepare, true);
				this.containsPasta = containsPasta;
			}

			Salad.prototype.toString = function() {
				var result = '';
				result += Meal.prototype.toString.call(this);
				result += 'Contains pasta: ' + (this.containsPasta ? 'yes' : 'no') + '\n';

				return result;
			};

			return Salad;
		}());

		var Command = (function() {

			function Command(commandLine) {
				this._params = new Array();
				this.translateCommand(commandLine);
			}

			Command.prototype.translateCommand = function(commandLine) {
				var self, paramsBeginning, name, parametersKeysAndValues;
				self = this;
				paramsBeginning = commandLine.indexOf("(");

				this._name = commandLine.substring(0, paramsBeginning);
				name = commandLine.substring(0, paramsBeginning);
				parametersKeysAndValues = commandLine
					.substring(paramsBeginning + 1, commandLine.length - 1)
					.split(";")
					.filter(function(e) {
						return true
					});

				parametersKeysAndValues.forEach(function(p) {
					var split = p
						.split("=")
						.filter(function(e) {
							return true;
						});
					self._params[split[0]] = split[1];
				});
			};

			return Command;
		}());

		function createRestaurant(name, location) {
			_restaurants[name] = new Restaurant(name, location);
			return "Restaurant " + name + " created\n";
		}

		function createDrink(name, price, calories, quantity, timeToPrepare, isCarbonated) {
			_recipes[name] = new Drink(name, price, calories, quantity, timeToPrepare, isCarbonated);
			return "Recipe " + name + " created\n";
		}

		function createSalad(name, price, calories, quantity, timeToPrepare, containsPasta) {
			_recipes[name] = new Salad(name, price, calories, quantity, timeToPrepare, containsPasta);
			return "Recipe " + name + " created\n";
		}

		function createMainCourse(name, price, calories, quantity, timeToPrepare, isVegan, type) {
			_recipes[name] = new MainCourse(name, price, calories, quantity, timeToPrepare, isVegan, type);
			return "Recipe " + name + " created\n";
		}

		function createDessert(name, price, calories, quantity, timeToPrepare, isVegan) {
			_recipes[name] = new Dessert(name, price, calories, quantity, timeToPrepare, isVegan);
			return "Recipe " + name + " created\n";
		}

		function toggleSugar(name) {
			var recipe;

			if (!_recipes.hasOwnProperty(name)) {
				throw new Error("The recipe " + name + " does not exist");
			}
			recipe = _recipes[name];

			if (recipe instanceof Dessert) {
				recipe.toggleSugar();
				return "Command ToggleSugar executed successfully. New value: " + recipe._withSugar.toString().toLowerCase() + "\n";
			} else {
				return "The command ToggleSugar is not applicable to recipe " + name + "\n";
			}
		}

		function toggleVegan(name) {
			var recipe;

			if (!_recipes.hasOwnProperty(name)) {
				throw new Error("The recipe " + name + " does not exist");
			}

			recipe = _recipes[name];
			if (recipe instanceof Meal) {
				recipe.toggleVegan();
				return "Command ToggleVegan executed successfully. New value: " +
					recipe._isVegan.toString().toLowerCase() + "\n";
			} else {
				return "The command ToggleVegan is not applicable to recipe " + name + "\n";
			}
		}

		function printRestaurantMenu(name) {
			var restaurant;

			if (!_restaurants.hasOwnProperty(name)) {
				throw new Error("The restaurant " + name + " does not exist");
			}

			restaurant = _restaurants[name];
			return restaurant.printRestaurantMenu();
		}

		function addRecipeToRestaurant(restaurantName, recipeName) {
			var restaurant, recipe;

			if (!_restaurants.hasOwnProperty(restaurantName)) {
				throw new Error("The restaurant " + restaurantName + " does not exist");
			}
			if (!_recipes.hasOwnProperty(recipeName)) {
				throw new Error("The recipe " + recipeName + " does not exist");
			}

			restaurant = _restaurants[restaurantName];
			recipe = _recipes[recipeName];
			restaurant.addRecipe(recipe);
			return "Recipe " + recipeName + " successfully added to restaurant " + restaurantName + "\n";
		}

		function removeRecipeFromRestaurant(restaurantName, recipeName) {
			var restaurant, recipe;

			if (!_recipes.hasOwnProperty(recipeName)) {
				throw new Error("The recipe " + recipeName + " does not exist");
			}
			if (!_restaurants.hasOwnProperty(restaurantName)) {
				throw new Error("The restaurant " + restaurantName + " does not exist");
			}

			restaurant = _restaurants[restaurantName];
			recipe = _recipes[recipeName];
			restaurant.removeRecipe(recipe);
			return "Recipe " + recipeName + " successfully removed from restaurant " + restaurantName + "\n";
		}

		function executeCommand(commandLine) {
			var cmd, params, result;
			cmd = new Command(commandLine);
			params = cmd._params;

			switch (cmd._name) {
				case 'CreateRestaurant':
					result = createRestaurant(params["name"], params["location"]);
					break;
				case 'CreateDrink':
					result = createDrink(params["name"], parseFloat(params["price"]), parseInt(params["calories"]),
						parseInt(params["quantity"]), params["time"], parseBoolean(params["carbonated"]));
					break;
				case 'CreateSalad':
					result = createSalad(params["name"], parseFloat(params["price"]), parseInt(params["calories"]),
						parseInt(params["quantity"]), params["time"], parseBoolean(params["pasta"]));
					break;
				case "CreateMainCourse":
					result = createMainCourse(params["name"], parseFloat(params["price"]), parseInt(params["calories"]),
						parseInt(params["quantity"]), params["time"], parseBoolean(params["vegan"]), params["type"]);
					break;
				case "CreateDessert":
					result = createDessert(params["name"], parseFloat(params["price"]), parseInt(params["calories"]),
						parseInt(params["quantity"]), params["time"], parseBoolean(params["vegan"]));
					break;
				case "ToggleSugar":
					result = toggleSugar(params["name"]);
					break;
				case "ToggleVegan":
					result = toggleVegan(params["name"]);
					break;
				case "AddRecipeToRestaurant":
					result = addRecipeToRestaurant(params["restaurant"], params["recipe"]);
					break;
				case "RemoveRecipeFromRestaurant":
					result = removeRecipeFromRestaurant(params["restaurant"], params["recipe"]);
					break;
				case "PrintRestaurantMenu":
					result = printRestaurantMenu(params["name"]);
					break;
				default:
					throw new Error('Invalid command name: ' + cmdName);
			}

			return result;
		}

		function parseBoolean(value) {
			switch (value) {
				case "yes":
					return true;
				case "no":
					return false;
				default:
					throw new Error("Invalid boolean value: " + value);
			}
		}

		return {
			initialize: initialize,
			executeCommand: executeCommand
		};
	}());


	// Process the input commands and return the results
	var results = '';
	RestaurantEngine.initialize();
	commands.forEach(function(cmd) {
		if (cmd != "") {
			try {
				var cmdResult = RestaurantEngine.executeCommand(cmd);
				results += cmdResult;
			} catch (err) {
				results += err.message + "\n";
			}
		}
	});

	return results.trim();
	// console.log(results.trim());
	// debugger;
}

// ------------------------------------------------------------
// Read the input from the console as array and process it
// Remove all below code before submitting to the judge system!
// ------------------------------------------------------------


var test1 = [
	'CreateRestaurant(name=New Restaurant;location=Sofia)',
	'CreateRestaurant(location=Silicon Valley;name=SoftUni Restaurant)',
	'PrintRestaurantMenu(name=New Restaurant)',
	'CreateMainCourse(name=Grilled Chicken;price=5.88;calories=320;quantity=370;time=15;vegan=no;type=Meat)',
	'CreateMainCourse(name=Spaghetti Carbonara;time=25;price=7.39;type=Pasta;calories=455;quantity=450;vegan=no)',
	'CreateSalad(price=7.99;name=Mexican Bean Salad;pasta=no;quantity=300;time=14;calories=150)',
	'CreateDessert(calories=450;name=Black Magic Cake;quantity=150;price=1.500001;vegan=no;time=2)',
	'CreateDrink(name=Home-made Lemonade;price=2.41;carbonated=no;calories=10;time=5;quantity=200)',
	'PrintRestaurantMenu(name=SoftUni Restaurant)',
	'AddRecipeToRestaurant(recipe=Black Magic Cake;restaurant=SoftUni Restaurant)',
	'AddRecipeToRestaurant(restaurant=SoftUni Restaurant;recipe=Grilled Chicken)',
	'AddRecipeToRestaurant(restaurant=SoftUni Restaurant;recipe=Mexican Bean Salad)',
	'AddRecipeToRestaurant(recipe=Home-made Lemonade;restaurant=SoftUni Restaurant)',
	'AddRecipeToRestaurant(restaurant=SoftUni Restaurant;recipe=Spaghetti Carbonara)',
	'PrintRestaurantMenu(name=SoftUni Restaurant)',
	'AddRecipeToRestaurant(restaurant=New Restaurant;recipe=Spaghetti Carbonara)',
	'PrintRestaurantMenu(name=New Restaurant)',
	'RemoveRecipeFromRestaurant(restaurant=New Restaurant;recipe=Spaghetti Carbonara)',
	'PrintRestaurantMenu(name=New Restaurant)',
	'RemoveRecipeFromRestaurant(recipe=Spaghetti Carbonara;restaurant=SoftUni Restaurant)',
	'RemoveRecipeFromRestaurant(recipe=Grilled Chicken;restaurant=SoftUni Restaurant)',
	'PrintRestaurantMenu(name=SoftUni Restaurant)',
	'CreateMainCourse(name=Vegan Red Lentil Soup;vegan=yes;price=5.99;quantity=250;time=15;calories=150;type=Soup)',
	'AddRecipeToRestaurant(recipe=Vegan Red Lentil Soup;restaurant=New Restaurant)',
	'PrintRestaurantMenu(name=New Restaurant)',
	'ToggleVegan(name=Vegan Red Lentil Soup)',
	'PrintRestaurantMenu(name=New Restaurant)',
	'CreateDessert(name=Black Chocolate Cake;quantity=120;price=2.32;vegan=yes;time=6;calories=300)',
	'AddRecipeToRestaurant(recipe=Black Chocolate Cake;restaurant=New Restaurant)',
	'PrintRestaurantMenu(name=New Restaurant)',
	'ToggleSugar(name=Black Chocolate Cake)',
	'PrintRestaurantMenu(name=New Restaurant)',
	'PrintRestaurantMenu(name=No Such Restaurant)',
	'AddRecipeToRestaurant(restaurant=No Such Recipe;recipe=No Such Recipe)',
	'AddRecipeToRestaurant(restaurant=New Restaurant;recipe=No Such Recipe)',
	'ToggleSugar(name=Grilled Chicken)',
	'ToggleVegan(name=Home-made Lemonade)'
	// 'End'
];

processRestaurantManagerCommands(test1);
