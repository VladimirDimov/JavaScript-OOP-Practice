function processVehicleParkCommands(commands) {
    'use strict';
    if (!Array.prototype.find) {
        Array.prototype.find = function(predicate) {
            if (this == null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        };
    }

    var Validators = {
        validateNonEmptyString: function(str, methodName) {
            if (!str || str === '') {
                throw new Error('Invalid empty string. Method ' + methodName);
            };
        },
        validateNonNegativeNumber: function(number, methodName) {
            if (isNaN(number) || number < 0) {
                throw new Error('Invalid negative number. Method ' + methodName);
            };
        },
        validateTerrainCoverage: function(str, methodName) {
            if (str !== 'road' && str !== 'all') {
                throw new Error('Invalid terrain coverage. Method ' + methodName);
            };
        }
    }
    var Models = (function() {
        var Employee = (function() {
            function Employee(name, position, grade) {
                this.setName(name);
                this.setPosition(position);
                this.setGrade(grade);
            }

            Employee.prototype.getName = function() {
                return this._name;
            }

            Employee.prototype.setName = function(name) {
                if (name === undefined || name === "") {
                    throw new Error("Name cannot be empty or undefined.");
                }
                this._name = name;
            }

            Employee.prototype.getPosition = function() {
                return this._position;
            }

            Employee.prototype.setPosition = function(position) {
                if (position === undefined || position === "") {
                    throw new Error("Position cannot be empty or undefined.");
                }
                this._position = position;
            }

            Employee.prototype.getGrade = function() {
                return this._grade;
            }

            Employee.prototype.setGrade = function(grade) {
                if (grade === undefined || isNaN(grade) || grade < 0) {
                    throw new Error("Grade cannot be negative.");
                }
                this._grade = grade;
            }

            Employee.prototype.toString = function() {
                return " ---> " + this.getName() +
                    ",position=" + this.getPosition();
            }

            return Employee;
        }());

        var Vehicle = (function() {
            function Vehicle(brand, age, terrainCoverage, numberOfWheels) {
                this.setBrand(brand);
                this.setAge(age);
                this.setTerrainCoverage(terrainCoverage);
                this.setNumberOfWheels(numberOfWheels);
            }

            Vehicle.prototype.setBrand = function(value) {
                Validators.validateNonEmptyString(value, 'Vehicle.prototype.setBrand');
                this._brand = value;
            };
            Vehicle.prototype.getBrand = function() {
                return this._brand;
            };
            Vehicle.prototype.setAge = function(value) {
                Validators.validateNonNegativeNumber(value, 'Vehicle.prototype.setAge');
                this._age = value;
            };
            Vehicle.prototype.getAge = function() {
                return this._age;
            };
            Vehicle.prototype.setTerrainCoverage = function(value) {
                Validators.validateTerrainCoverage(value, 'Vehicle.prototype.setTerrainCoverage');
                this._terrainCoverage = value;
            };
            Vehicle.prototype.getTerrainCoverage = function() {
                return this._terrainCoverage;
            };
            Vehicle.prototype.setNumberOfWheels = function(value) {
                Validators.validateNonNegativeNumber(value, 'Vehicle.prototype.setNumberOfWheels');
                this._numberOfWheels = value;
            };
            Vehicle.prototype.getNumberOfWheels = function() {
                return this._numberOfWheels;
            };
            Vehicle.prototype.toString = function() {
                return ' -> ' + this.constructor.name +
                    ': brand=' + this.getBrand() +
                    ',age=' + this.getAge().toFixed(1) +
                    ',terrainCoverage=' + this.getTerrainCoverage() +
                    ',numberOfWheels=' + this.getNumberOfWheels();
            };

            return Vehicle;
        }());

        var Bike = (function() {
            function Bike(brand, age, terrainCoverage, frameSize, numberOfShifts) {
                Vehicle.call(this, brand, age, terrainCoverage, 2);
                this.setFrameSize(frameSize);
                this.setNumberOfShifts(numberOfShifts);
            }
            Bike.prototype = Object.create(Vehicle.prototype);
            Bike.prototype.constructor = Bike;

            Bike.prototype.setFrameSize = function(value) {
                Validators.validateNonNegativeNumber(value, 'Bike.prototype.setFrameSize');
                this._frameSize = value;
            };
            Bike.prototype.getFrameSize = function() {
                return this._frameSize;
            };
            Bike.prototype.setNumberOfShifts = function(value) {
                if (value) {
                    Validators.validateNonNegativeNumber(value, 'Bike.prototype.setNumberOfShifts');
                };

                this._numberOfShifts = value;
            };
            Bike.prototype.getNumberOfShifts = function() {
                return this._numberOfShifts;
            };
            Bike.prototype.toString = function() {
                var shiftsText = this.getNumberOfShifts() ?
                    ',numberOfShifts=' + this.getNumberOfShifts() :
                    '';
                return Vehicle.prototype.toString.call(this) +
                    ',frameSize=' + this.getFrameSize() +
                    shiftsText;
            }
            return Bike;
        }());

        var Automobile = (function() {
            function Automobile(brand, age, terrainCoverage, numberOfWheels, consumption, typeOfFuel) {
                Vehicle.call(this, brand, age, terrainCoverage, numberOfWheels);
                this.setConsumption(consumption);
                this.setTypeOfFuel(typeOfFuel);
            }

            Automobile.prototype = Object.create(Vehicle.prototype);
            Automobile.prototype.constructor = Automobile;

            Automobile.prototype.setConsumption = function(value) {
                if (value) {
                    Validators.validateNonNegativeNumber(value, 'Automobile.prototype.setConsumption');
                };

                this._consumption = value;
            };
            Automobile.prototype.getConsumption = function() {
                return this._consumption;
            };
            Automobile.prototype.setTypeOfFuel = function(value) {
                Validators.validateNonEmptyString(value, 'Automobile.prototype.setTypeOfFuel');
                this._typeOfFuel = value;
            };
            Automobile.prototype.getTypeOfFuel = function() {
                return this._typeOfFuel;
            };
            Automobile.prototype.toString = function() {
                return Vehicle.prototype.toString.call(this) +
                    ',consumption=[' + this.getConsumption() + 'l/100km ' + this.getTypeOfFuel() + ']';
            };
            return Automobile;
        }());

        var Truck = (function() {
            // default terrain coverage “all” and always has 4 wheels
            function Truck(brand, age, terrainCoverage, consumption, typeOfFuel, numberOfDoors) {
                terrainCoverage = terrainCoverage || 'all'
                Automobile.call(this, brand, age, terrainCoverage, 4, consumption, typeOfFuel);
                this.setNumberOfDoors(numberOfDoors);
            }

            Truck.prototype = Object.create(Automobile.prototype);
            Truck.prototype.constructor = Truck;

            Truck.prototype.setNumberOfDoors = function(value) {
                Validators.validateNonNegativeNumber(value, 'Truck.prototype.setNumberOfDoors');
                this._numberOfDoors = value;
            };
            Truck.prototype.getNumberOfDoors = function() {
                return this._numberOfDoors;
            };
            Truck.prototype.toString = function() {
                return Automobile.prototype.toString.call(this) +
                    ',numberOfDoors=' + this.getNumberOfDoors();
            };
            return Truck;
        }());

        var Limo = (function() {
            // Limo – always has terrain coverage “road” and holds a set of employees, has appendEmployee() and detachEmployee() methods– throws an error if it contains no such employee.
            function Limo(brand, age, numberOfWheels, consumption, typeOfFuel) {
                Automobile.call(this, brand, age, 'road', numberOfWheels, consumption, typeOfFuel);
                this._employees = [];
            }
            Limo.prototype = Object.create(Automobile.prototype);
            Limo.prototype.constructor = Limo;

            Limo.prototype.appendEmployee = function(employee) {
                if (!limoHasEmployee.call(this, employee)) {
                    this._employees.push(employee);
                };
            };
            Limo.prototype.detachEmployee = function(employee) {
                var foundItemIndex = -1;
                if (this._employees.find(function(item, index) {
                        foundItemIndex = index;
                        return item.getName() === employee.getName();
                    })) {
                    this._employees = this._employees.splice(foundItemIndex, 1);
                }               
            };
            Limo.prototype.toString = function() {
                var employeesText = getEmployeesAsListOfStrings.call(this).join('\n');

                if (employeesText !== '') {
                    employeesText = ' --> Employees, allowed to drive:\n' + employeesText;
                } else {
                    employeesText = ' --> Employees, allowed to drive: ---';
                };

                return Automobile.prototype.toString.call(this) + '\n' +
                    employeesText;
            };

            function limoHasEmployee(employee) {
                if (this._employees.some(function(item) {
                        return item.getName() === employee.getName();
                    })) {
                    return true;
                };

                return false;
            }

            function getEmployeesAsListOfStrings() {
                var listOfEmployees = this._employees.map(function(item) {
                    return item.toString();
                });

                return listOfEmployees;
            }

            return Limo;
        }());

        return {
            Employee: Employee,
            Bike: Bike,
            Truck: Truck,
            Limo: Limo
        }
    }());

    var ParkManager = (function() {
        var _vehicles;
        var _employees;

        function init() {
            _vehicles = [];
            _employees = [];
        }

        var CommandProcessor = (function() {

            function processInsertCommand(command) {
                var object;

                switch (command["type"]) {
                    case "bike":
                        object = new Models.Bike(
                            command["brand"],
                            parseFloat(command["age"]),
                            command["terrain-coverage"],
                            parseFloat(command["frame-size"]),
                            command["number-of-shifts"]);
                        _vehicles.push(object);
                        break;
                    case "truck":
                        object = new Models.Truck(
                            command["brand"],
                            parseFloat(command["age"]),
                            command["terrain-coverage"],
                            parseFloat(command["consumption"]),
                            command["type-of-fuel"],
                            parseFloat(command["number-of-doors"]));
                        _vehicles.push(object);
                        break;
                    case "limo":
                        object = new Models.Limo(
                            command["brand"],
                            parseFloat(command["age"]),
                            parseFloat(command["number-of-wheels"]),
                            parseFloat(command["consumption"]),
                            command["type-of-fuel"]);
                        _vehicles.push(object);
                        break;
                    case "employee":
                        object = new Models.Employee(command["name"], command["position"], parseFloat(command["grade"]));
                        _employees.push(object);
                        break;
                    default:
                        throw new Error("Invalid type.");
                }

                return object.constructor.name + " created.";
            }

            function processDeleteCommand(command) {
                var object,
                    index;

                switch (command["type"]) {
                    case "employee":
                        object = getEmployeeByName(command["name"]);
                        _vehicles.forEach(function(t) {
                            if (t instanceof Models.Limo && t.getEmployees().indexOf(object) !== -1) {
                                t.detachEmployee(object);
                            }
                        });
                        index = _employees.indexOf(object);
                        _employees.splice(index, 1);
                        break;
                    case "bike":
                    case "truck":
                    case "limo":
                        object = getVehicleByBrandAndType(command["brand"], command["type"]);
                        index = _vehicles.indexOf(object);
                        _vehicles.splice(index, 1);
                        break;
                    default:
                        throw new Error("Unknown type.");
                }

                return object.constructor.name + " deleted.";
            }

            function processListCommand(command) {
                return formatOutputList(_vehicles);
            }

            function processListEmployees(command) {
                var sortBy = command.grade,
                    selectedEmployees;

                if (sortBy === 'all') {
                    selectedEmployees = Object.create(_employees);
                } else {
                    sortBy = Number(sortBy);
                    selectedEmployees = _employees.filter(function(item) {
                        return item.getGrade() >= sortBy;
                    });
                };

                return 'List Output:\n' +
                    (selectedEmployees.sort(function(a, b) {
                        if (a.getName() < b.getName()) {
                            return -1;
                        } else if (a.getName() > b.getName()) {
                            return 1;
                        } else {
                            return 0;
                        };
                    })).join('\n');
            }

            function processAppendEmployeeCommand(command) {
                var employee = getEmployeeByName(command["name"]);
                var limos = getLimosByBrand(command["brand"]);

                for (var i = 0; i < limos.length; i++) {
                    limos[i].appendEmployee(employee);
                }
                return "Added employee to possible Limos.";
            }

            function processDetachEmployeeCommand(command) {
                var employee = getEmployeeByName(command["name"]);
                var limos = getLimosByBrand(command["brand"]);

                for (var i = 0; i < limos.length; i++) {
                    limos[i].detachEmployee(employee);
                }

                return "Removed employee from possible Limos.";
            }

            // Functions below are not revealed

            function getVehicleByBrandAndType(brand, type) {
                for (var i = 0; i < _vehicles.length; i++) {
                    if (_vehicles[i].constructor.name.toString().toLowerCase() === type &&
                        _vehicles[i].getBrand() === brand) {
                        return _vehicles[i];
                    }
                }
                throw new Error("No Limo with such brand exists.");
            }

            function getLimosByBrand(brand) {
                var currentVehicles = [];
                for (var i = 0; i < _vehicles.length; i++) {
                    if (_vehicles[i] instanceof Models.Limo &&
                        _vehicles[i].getBrand() === brand) {
                        currentVehicles.push(_vehicles[i]);
                    }
                }
                if (currentVehicles.length > 0) {
                    return currentVehicles;
                }
                throw new Error("No Limo with such brand exists.");
            }

            function getEmployeeByName(name) {

                for (var i = 0; i < _employees.length; i++) {
                    if (_employees[i].getName() === name) {
                        return _employees[i];
                    }
                }
                throw new Error("No Employee with such name exists.");
            }

            function formatOutputList(output) {
                var queryString = "List Output:\n";

                if (output.length > 0) {
                    queryString += output.join("\n");
                } else {
                    queryString = "No results.";
                }

                return queryString;
            }

            return {
                processInsertCommand: processInsertCommand,
                processDeleteCommand: processDeleteCommand,
                processListCommand: processListCommand,
                processAppendEmployeeCommand: processAppendEmployeeCommand,
                processDetachEmployeeCommand: processDetachEmployeeCommand,
                processListEmployees: processListEmployees
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
                case "append-employee":
                    output = CommandProcessor.processAppendEmployeeCommand(commandArgs);
                    break;
                case "detach-employee":
                    output = CommandProcessor.processDetachEmployeeCommand(commandArgs);
                    break;
                case "list":
                    output = CommandProcessor.processListCommand(commandArgs);
                    break;
                case "list-employees":
                    output = CommandProcessor.processListEmployees(commandArgs);
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

    var output = "";
    ParkManager.init();

    commands.forEach(function(cmd) {
        var result;
        if (cmd != "") {
            try {
                result = ParkManager.executeCommands(cmd) + "\n";
            } catch (e) {
                result = "Invalid command." + "\n";
                // result = e.message + "\n";
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
            console.log(processVehicleParkCommands(arr));
        });
    }
})();