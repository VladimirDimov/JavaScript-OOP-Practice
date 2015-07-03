function processTravelAgencyCommands(commands) {
	'use strict';

	var Validators = {
		validateNotEmptyString: function(value, methodName) {
			if (!value) {
				throw new Error('Invalid null value. Method ' + methodName);
			};
			if (value === '') {
				throw new Error('Invalid empty string. Method ' + methodName);
			};
		},
		validateDate: function(value, methodName) {
			if (!value) {
				throw new Error('Invalid null value. Method ' + methodName);
			};
			if (!(value instanceof(Date))) {
				throw new Error('Invalid date object. Method ' + methodName);
			};
		},
		validateNonNegativeNumber: function(value, methodName) {
			if (isNaN(value)) {
				throw new Error('Value is not a number. Method ' + methodName);
			};
			if (value < 0) {
				throw new Error('Invalid negative number. Method ' + methodName);
			};
		}
	};

	var Models = (function() {
		var Destination = (function() {
			var Destination = {
				init: function(location, landmark) {
					this.location = location;
					this.landmark = landmark;
					this.typeName = 'Destination';
					return this;
				},
				set location(value) {
					Validators.validateNotEmptyString(value, 'Models.location');
					this._location = value;
				},
				get location() {
					return this._location;
				},
				set landmark(value) {
					Validators.validateNotEmptyString(value, 'Models.landmark');
					this._landmark = value;
				},
				get landmark() {
					return this._landmark;
				},
				toString() {
					return 'Destination: location=' + this.location + ',landmark=' + this.landmark;
				}
			};

			return Destination;
		}());

		var Travel = (function() {
			var Travel = {
				init: function(name, startDate, endDate, price) {
					this.name = name;
					this.startDate = startDate;
					this.endDate = endDate;
					this.price = price;
					this.typeName = 'Travel';

					return this;
				},
				set name(value) {
					Validators.validateNotEmptyString(value);
					this._name = value;
				},
				get name() {
					return this._name;
				},
				set startDate(value) {
					Validators.validateDate(value);
					this._startDate = value;
				},
				get startDate() {
					return this._startDate;
				},
				set endDate(value) {
					Validators.validateDate(value);
					this._endDate = value;
				},
				get endDate() {
					return this._endDate;
				},
				set price(value) {
					Validators.validateNonNegativeNumber(value);
					this._price = value;
				},
				get price() {
					return this._price;
				},
				toString() {
					return ' * ' + this.typeName + ': name=' + this.name + ',start-date=' + formatDate(this.startDate) + ',end-date=' + formatDate(this.endDate) + ',price=' + this.price.toFixed(2);
				}
			};

			return Travel;
		}());

		var Excursion = (function(parent) {
			var Excursion = Object.create(parent, {
				init: {
					value: function(name, startDate, endDate, price, transport) {
						parent.init.call(this, name, startDate, endDate, price);
						this.transport = transport;
						this.typeName = 'Excursion';
						this._destinations = [];

						return this;
					}
				},
				transport: {
					set: function(value) {
						Validators.validateNotEmptyString(value);
						this._transport = value;
					},
					get: function() {
						return this._transport;
					}
				},
				addDestination: {
					value: function(value) {
						if (!isValidDestination(value)) {
							throw new Error('Invalid destination object');
						};

						this._destinations.push(value);
					}
				},
				removeDestination: {
					value: function(value) {
						if (isValidDestination(value)) {
							this._destinations = this._destinations.filter(function(item) {
								return !(item.location === value.location &&
									item.landmark === value.landmark);
							});
						};
					}
				},
				getDestinations: {
					value: function() {
						return this._destinations;
					}
				},
				toString: {
					value: function() {
						return parent.toString.call(this) + ',transport=' + this.transport + getDestinationsText(this);
					}
				}
			});

			function isValidDestination(value) {
				if (Models.Destination.isPrototypeOf(value)) {
					return true;
				};
				return false;
			}

			function getDestinationsText(that) {
				if (that.typeName === 'Excursion') {
					var destinationsText = that.getDestinations().join(';') || '-';
					return '\n ** Destinations: ' + destinationsText;
				};
				return '';
			}

			return Excursion;
		})(Travel);

		var Vacation = (function(parent) {
			var Vacation = Object.create(parent);
			Object.defineProperties(Vacation, {
				init: {
					value: function(name, startDate, endDate, price, location, accommodation) {
						parent.init.call(this, name, startDate, endDate, price);
						this.location = location;
						this.accommodation = accommodation;
						this.typeName = 'Vacation';

						return this;
					}
				},
				location: {
					set: function(value) {
						Validators.validateNotEmptyString(value);
						this._location = value;
					},
					get: function() {
						return this._location;
					}
				},
				accommodation: {
					set: function(value) {
						if (value) {
							Validators.validateNotEmptyString(value);
						};

						this._accomodation = value;
					},
					get: function() {
						return this._accomodation;
					}
				},
				toString: {
					value: function() {
						var accommodationText = this.accommodation ? ',accommodation=' + this.accommodation : '';
						return parent.toString.call(this) + ',location=' + this.location + accommodationText;
					}
				}
			});

			return Vacation;
		}(Travel));

		var Cruise = (function(parent) {
			var Cruise = Object.create(parent, {
				init: {
					value: function(name, startDate, endDate, price, transport, startDock) {
						parent.init.call(this, name, startDate, endDate, price, 'cruise liner');
						this.typeName = 'Cruise';
						this.startDock = startDock;

						return this;
					}
				},
				startDock: {
					set: function(value) {
						if (value) {
							Validators.validateNotEmptyString(value);
						};
						this._startDock = value;
					},
					get: function() {
						return this._startDock;
					}
				},
				toString: {
					value: function() {
						var startDockText = this.startDock ? ',start-dock=' + this.startDock : '',
							destinationsText = this.getDestinations().join(';') || '-';
						return parent.toString.call(this) + startDockText +
							'\n ** Destinations: ' + destinationsText;
					}
				}

			});

			return Cruise;
		}(Excursion));

		return {
			Destination: Destination,
			Vacation: Vacation,
			Excursion: Excursion,
			Cruise: Cruise,
			Destination: Destination
		}
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
						object = Object.create(Models.Excursion)
							.init(command["name"], parseDate(command["start-date"]), parseDate(command["end-date"]),
								parseFloat(command["price"]), command["transport"]);
						_travels.push(object);
						break;
					case "vacation":
						object = Object.create(Models.Vacation)
							.init(command["name"], parseDate(command["start-date"]), parseDate(command["end-date"]),
								parseFloat(command["price"]), command["location"], command["accommodation"]);
						_travels.push(object);
						break;
					case "cruise":
						object = Object.create(Models.Cruise)
							.init(command["name"], parseDate(command["start-date"]), parseDate(command["end-date"]),
								parseFloat(command["price"]), command["start-dock"]);
						_travels.push(object);
						break;
					case "destination":
						object = Object.create(Models.Destination)
							.init(command["location"], command["landmark"]);
						_destinations.push(object);
						break;
					default:
						throw new Error("Invalid type.");
				}

				return object.typeName + " created.";
			}

			function processDeleteCommand(command) {
				var object,
					index,
					destinations;

				switch (command["type"]) {
					case "destination":
						object = getDestinationByLocationAndLandmark(command["location"], command["landmark"]);
						_travels.forEach(function(t) {
							if (Models.Excursion.isPrototypeOf(t) && t.getDestinations().indexOf(object) !== -1) {
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

				return object.typeName + " deleted.";
			}

			function processListCommand(command) {
				return formatTravelsQuery(_travels);
			}

			function processFilterTravelsCommand(command) {
				var type = command.type,
					minPrice = Number(command['price-min']),
					maxPrice = Number(command['price-max']),
					filteredTravels;

				Validators.validateNonNegativeNumber(minPrice);
				Validators.validateNonNegativeNumber(maxPrice);
				Validators.validateNotEmptyString(type);

				if (type !== 'all') {
					filteredTravels = _travels.filter(function(item) {
						return item.typeName.toLowerCase() === type.toLowerCase();
					});
				} else {
					filteredTravels = Object.create(_travels);
				};

				filteredTravels = filteredTravels.filter(function(item) {
					return item.price >= minPrice && item.price <= maxPrice;
				});

				return formatTravelsQuery(filteredTravels.sort(function(a, b) {
					return (a.startDate - b.startDate) || a.name.localeCompare(b.name);
				}));
			}

			function processAddDestinationCommand(command) {
				var destination = getDestinationByLocationAndLandmark(command["location"], command["landmark"]),
					travel = getTravelByName(command["name"]);

				if (!(Models.Excursion.isPrototypeOf(travel))) {
					throw new Error("Travel does not have destinations.");
				}
				travel.addDestination(destination);

				return "Added destination to " + travel.name + ".";
			}

			function processRemoveDestinationCommand(command) {
				var destination = getDestinationByLocationAndLandmark(command["location"], command["landmark"]),
					travel = getTravelByName(command["name"]);

				if (!(travel.typeName === 'Excursion')) {
					throw new Error("Travel does not have destinations.");
				}
				travel.removeDestination(destination);

				return "Removed destination from " + travel.name + ".";
			}

			function getTravelByName(name) {
				var i;

				for (i = 0; i < _travels.length; i++) {
					if (_travels[i].name === name) {
						return _travels[i];
					}
				}
				throw new Error("No travel with such name exists.");
			}

			function getDestinationByLocationAndLandmark(location, landmark) {
				var i;

				for (i = 0; i < _destinations.length; i++) {
					if (_destinations[i].location === location && _destinations[i].landmark === landmark) {
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
			}
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
		}
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
		if (cmd != "") {
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