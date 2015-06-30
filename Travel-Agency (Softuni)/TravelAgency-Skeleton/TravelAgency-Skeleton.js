function processTravelAgencyCommands(commands) {
	'use strict';

	var Models = (function() {
		var Destination = (function() {
			function Destination(location, landmark) {
				this.setLocation(location);
				this.setLandmark(landmark);
			}

			Destination.prototype.getLocation = function() {
				return this._location;
			};

			Destination.prototype.setLocation = function(location) {
				if (location === undefined || location === "") {
					throw new Error("Location cannot be empty or undefined.");
				}
				this._location = location;
			};

			Destination.prototype.getLandmark = function() {
				return this._landmark;
			};

			Destination.prototype.setLandmark = function(landmark) {
				if (landmark === undefined || landmark == "") {
					throw new Error("Landmark cannot be empty or undefined.");
				}
				this._landmark = landmark;
			};

			Destination.prototype.toString = function() {
				return this.constructor.name + ": " +
					"location=" + this.getLocation() +
					",landmark=" + this.getLandmark();
			};

			return Destination;
		}());

		var Validators = {
			validateNonEmptyStringMandatory: function(value, methodName) {
				if (!value) {
					throw new Error('Missing string from ' + methodName);
				}
				if (value === '') {
					throw new Error('Invalid empty string from ' + methodName);
				}
			},
			validatePositiveNumber: function(number, methodName) {
				if (!number) {
					throw new Error('Missing number from ' + methodName);
				}
				if (isNaN(number)) {
					throw new Error('Invalid not a number value from ' + methodName);
				}
				if (number < 0) {
					throw new Error('Invalid negative value ' + methodName);
				}
			}
		};

		var Travel = (function() {
			function Travel(name, startDate, endDate, price) {
				this.setName(name);
				this.setStartDate(startDate);
				this.setEndDate(endDate);
				this.setPrice(price);
			}
			Travel.prototype.setName = function(value) {
				Validators.validateNonEmptyStringMandatory(value, 'Travel.prototype.setName');
				this._name = value;
			};
			Travel.prototype.setStartDate = function(value) {
				this._startDate = value;
			};
			Travel.prototype.setEndDate = function(value) {
				this._endDate = value;
			};
			Travel.prototype.setPrice = function(value) {
				Validators.validatePositiveNumber(value);
				this._price = value;
			};
			Travel.prototype.getName = function() {
				return this._name;
			};
			Travel.prototype.getStartDate = function() {
				return this._startDate;
			};
			Travel.prototype.getEndDate = function() {
				return this._endDate;
			};
			Travel.prototype.getPrice = function() {
				return this._price;
			};
			Travel.prototype.toString = function() {
				//name, price, startDate, endDate
				return ' * ' + this.constructor.name + ': name=' + this.getName() +
					',start-date=' + formatDate(this.getStartDate()) +
					',end-date=' + formatDate(this.getEndDate()) +
					',price=' + this.getPrice().toFixed(2);
			};

			return Travel;
		}());

		var Excursion = (function() {
			function Excursion(name, startDate, endDate, price, transport) {
				Travel.call(this, name, startDate, endDate, price);
				this.setTransport(transport);
				this._destinations = [];
			}
			Excursion.prototype = Object.create(Travel.prototype);
			Excursion.prototype.constructor = Excursion;

			Excursion.prototype.setTransport = function(value) {
				Validators.validateNonEmptyStringMandatory(value);
				this._transport = value;
			};
			Excursion.prototype.getTransport = function() {
				return this._transport;
			};
			Excursion.prototype.addDestination = function(destination) {
				this._destinations.push(destination);
			};
			Excursion.prototype.removeDestination = function(destination) {
				var len = this._destinations.length;
				this._destinations = this._destinations.filter(function(element) {
					return element.getLocation() != destination.getLocation() &&
						element.getLandmark() != destination.getLandmark();
				});

				if (this._destinations.length == len) {
					throw new Error('Excursion don\'t have the destination' + destination.toString());
				}
			};
			Excursion.prototype.getDestinations = function() {
				return this._destinations;
			};
			Excursion.prototype.toString = function() {
				// name, startDate, endDate, price, transport
				return Travel.prototype.toString.call(this) +
					',transport=' + this.getTransport() + this.destinationsToString();
			};
			Excursion.prototype.destinationsToString = function() {
				var result = '\n';
				result += ' ** Destinations: ';
				if (this.getDestinations().length == 0) {
					result += '-';
				} else {
					result += this.getDestinations().join(';');
				};

				return result;
			}
			return Excursion;
		}());

		var Vacation = (function() {
			function Vacation(name, price, startDate, endDate, location, accommodation) {
				Travel.call(this, name, price, startDate, endDate);
				this.setLocation(location);
				this.setAccomodation(accommodation);
			}
			Vacation.prototype = Object.create(Travel.prototype);
			Vacation.prototype.constructor = Vacation;

			Vacation.prototype.setLocation = function(value) {
				Validators.validateNonEmptyStringMandatory(value);
				this._location = value;
			};
			Vacation.prototype.getLocation = function() {
				return this._location;
			};
			Vacation.prototype.setAccomodation = function(value) {
				if (value) {
					Validators.validateNonEmptyStringMandatory(value);
				}

				this._accommodation = value;
			};
			Vacation.prototype.getAccommodation = function() {
				return this._accommodation;
			}
			Vacation.prototype.toString = function() {
				// location, accommodation
				var accomodationText = this.getAccommodation() ? ',accommodation=' + this.getAccommodation() : '';
				return Travel.prototype.toString.call(this) +
					',location=' + this.getLocation() +
					accomodationText;
			};

			return Vacation;
		}());

		var Cruise = (function() {
			function Cruise(name, startDate, endDate, price, startDock) {
				Excursion.call(this, name, startDate, endDate, price, 'cruise liner');
				this.setStartDock(startDock);
			}

			Cruise.prototype = Object.create(Excursion.prototype);
			Cruise.prototype.constructor = Cruise;

			Cruise.prototype.setStartDock = function(value) {
				if (value) {
					Validators.validateNonEmptyStringMandatory(value);
				}
				this._startDock = value;
			};
			Cruise.prototype.getStartDock = function() {
				return this._startDock;
			};
			Cruise.prototype.toString = function() {
				// name, startDate, endDate, price, startDock
				// var startDockText = this.getStartDock() ? ',start-dock=' + this.getStartDock() : '';
				return Travel.prototype.toString.call(this) +
					',transport=' + this.getTransport() + this.destinationsToString();
			};

			return Cruise;
		}());

		return {
			Destination: Destination,
			Cruise: Cruise,
			Vacation: Vacation,
			Excursion: Excursion
		};
	}());

	var TravellingManager = (function() {
		var _travels;
		var _destinations;

		function init() {
			_travels = [];
			_destinations = [];
		}

		var CommandProcessor = (function() {

			function processInsertCommand(command) {
				var object;

				switch (command["type"]) {
					case "excursion":
						object = new Models.Excursion(command["name"], parseDate(command["start-date"]), parseDate(command["end-date"]),
							parseFloat(command["price"]), command["transport"]);
						_travels.push(object);
						break;
					case "vacation":
						object = new Models.Vacation(command["name"], parseDate(command["start-date"]), parseDate(command["end-date"]),
							parseFloat(command["price"]), command["location"], command["accommodation"]);
						_travels.push(object);
						break;
					case "cruise":
						object = new Models.Cruise(command["name"], parseDate(command["start-date"]), parseDate(command["end-date"]),
							parseFloat(command["price"]), command["start-dock"]);
						_travels.push(object);
						break;
					case "destination":
						object = new Models.Destination(command["location"], command["landmark"]);
						_destinations.push(object);
						break;
					default:
						throw new Error("Invalid type.");
				}

				return object.constructor.name + " created.";
			}

			function processDeleteCommand(command) {
				var object,
					index,
					destinations;

				switch (command["type"]) {
					case "destination":
						object = getDestinationByLocationAndLandmark(command["location"], command["landmark"]);
						_travels.forEach(function(t) {
							if (t instanceof Models.Excursion && t.getDestinations().indexOf(object) !== -1) {
								t.removeDestination(object);
							}
						});
						index = _destinations.indexOf(object);
						_destinations.splice(index, 1);
						break;
					case "excursion":
					case "vacation":
					case "cruise":
						object = getTravelByName(command["name"]);
						index = _travels.indexOf(object);
						_travels.splice(index, 1);
						break;
					default:
						throw new Error("Unknown type.");
				}

				return object.constructor.name + " deleted.";
			}

			function processListCommand(command) {
				return formatTravelsQuery(_travels);
			}

			function processAddDestinationCommand(command) {
				var destination = getDestinationByLocationAndLandmark(command["location"], command["landmark"]),
					travel = getTravelByName(command["name"]);

				if (!(travel instanceof Models.Excursion)) {
					throw new Error("Travel does not have destinations.");
				}
				travel.addDestination(destination);

				return "Added destination to " + travel.getName() + ".";
			}

			function processRemoveDestinationCommand(command) {
				var destination = getDestinationByLocationAndLandmark(command["location"], command["landmark"]),
					travel = getTravelByName(command["name"]);

				if (!(travel instanceof Models.Excursion)) {
					throw new Error("Travel does not have destinations.");
				}
				travel.removeDestination(destination);

				return "Removed destination from " + travel.getName() + ".";
			}

			function processFilterTravelsCommand(commands) {
				var type, minPrice, maxPrice, filteredTravels;
				type = commands.type;
				minPrice = Number(commands['price-min']);
				maxPrice = Number(commands['price-max']);

				if (type != 'all') {
					filteredTravels = _travels.filter(function(element) {
						return element.constructor.name.toLowerCase() === type.toLowerCase();
					});
				}else{
					filteredTravels = Object.create(_travels);
				};

				filteredTravels = filteredTravels.filter(function(element) {
					return element.getPrice() >= minPrice &&
						element.getPrice() <= maxPrice;
				});

				filteredTravels = filteredTravels.sort(function(a, b){
					if (a.getStartDate() < b.getStartDate()) {
						return -1;
					}else if (a.getStartDate() > b.getStartDate()) {
						return 1;
					}else{
						if (a.getName() < b.getName()) {
							return -1;
						}else{
							return 1;
						};
					};
				});

				return formatTravelsQuery(filteredTravels);
			}

			function getTravelByName(name) {
				var i;

				for (i = 0; i < _travels.length; i++) {
					if (_travels[i].getName() === name) {
						return _travels[i];
					}
				}
				throw new Error("No travel with such name exists.");
			}

			function getDestinationByLocationAndLandmark(location, landmark) {
				var i;

				for (i = 0; i < _destinations.length; i++) {
					if (_destinations[i].getLocation() === location && _destinations[i].getLandmark() === landmark) {
						return _destinations[i];
					}
				}
				throw new Error("No destination with such location and landmark exists.");
			}

			function formatTravelsQuery(travelsQuery) {
				var queryString = "";

				if (travelsQuery.length > 0) {
					queryString += travelsQuery.join("\n");
				} else {
					queryString = "No results.";
				}

				return queryString;
			}

			return {
				processInsertCommand: processInsertCommand,
				processDeleteCommand: processDeleteCommand,
				processListCommand: processListCommand,
				processAddDestinationCommand: processAddDestinationCommand,
				processRemoveDestinationCommand: processRemoveDestinationCommand,
				processFilterTravelsCommand: processFilterTravelsCommand
			};
		}());

		var Command = (function() {
			function Command(cmdLine) {
				this._cmdArgs = processCommand(cmdLine);
			}

			function processCommand(cmdLine) {
				var parameters = [],
					matches = [],
					pattern = /(.+?)=(.+?)[;)]/g,
					key,
					value,
					split;

				split = cmdLine.split("(");
				parameters["command"] = split[0];
				while ((matches = pattern.exec(split[1])) !== null) {
					key = matches[1];
					value = matches[2];
					parameters[key] = value;
				}

				return parameters;
			}

			return Command;
		}());

		function executeCommands(cmds) {
			var commandArgs = new Command(cmds)._cmdArgs,
				action = commandArgs["command"],
				output;

			switch (action) {
				case "insert":
					output = CommandProcessor.processInsertCommand(commandArgs);
					break;
				case "delete":
					output = CommandProcessor.processDeleteCommand(commandArgs);
					break;
				case "add-destination":
					output = CommandProcessor.processAddDestinationCommand(commandArgs);
					break;
				case "remove-destination":
					output = CommandProcessor.processRemoveDestinationCommand(commandArgs);
					break;
				case "list":
					output = CommandProcessor.processListCommand(commandArgs);
					break;
				case "filter":
					output = CommandProcessor.processFilterTravelsCommand(commandArgs);
					break;
				default:
					throw new Error("Unsupported command.");
			}

			return output;
		}

		return {
			init: init,
			executeCommands: executeCommands
		};
	}());

	var parseDate = function(dateStr) {
		if (!dateStr) {
			return undefined;
		}
		var date = new Date(Date.parse(dateStr.replace(/-/g, ' ')));
		var dateFormatted = formatDate(date);
		if (dateStr != dateFormatted) {
			throw new Error("Invalid date: " + dateStr);
		}
		return date;
	}

	var formatDate = function(date) {
		var day = date.getDate();
		var monthName = date.toString().split(' ')[1];
		var year = date.getFullYear();
		return day + '-' + monthName + '-' + year;
	}

	var output = "";
	TravellingManager.init();

	commands.forEach(function(cmd) {
		var result;
		// output += TravellingManager.executeCommands(cmd) + "\n";
		if (cmd !== "") {
			try {
				result = TravellingManager.executeCommands(cmd) + "\n";
			} catch (e) {
				result = "Invalid command." + "\n";
			}
			output += result;
		}
	});

	return output;
}

// ------------------------------------------------------------
// Read the input from the console as array and process it
// Remove all below code before submitting to the judge system!
// ------------------------------------------------------------

(function() {
	var arr = [];
	if (typeof(require) == 'function') {
		// We are in node.js --> read the console input and process it
		require('readline').createInterface({
			input: process.stdin,
			output: process.stdout
		}).on('line', function(line) {
			arr.push(line);
		}).on('close', function() {
			console.log(processTravelAgencyCommands(arr));
		});
	}
})();