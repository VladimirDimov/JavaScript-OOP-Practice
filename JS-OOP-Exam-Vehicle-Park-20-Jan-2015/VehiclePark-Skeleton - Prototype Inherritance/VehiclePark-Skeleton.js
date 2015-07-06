function processVehicleParkCommands(commands) {
    'use strict';
    if (!Array.prototype.find) {
        Array.prototype.find = function(predicate) {
            if (this === null) {
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
        validateNonEmptyString: function(value) {
            if (value === undefined || value === '') {
                throw new Error('Invalid string value');
            }
        },
        validateNonNegativeNumber: function(value) {
            if (isNaN(value) || value < 0) {
                throw new Error('Invalid non negative value');
            }
        },
        validateNonNegativeInteger: function(value) {
            if (isNaN(value) || (value % 1) !== 0 || value < 0) {
                throw new Error('Invalid non negative integer value');
            }
        }
    };

    var Models = (function() {
        var Employee = (function() {
            var Employee = {
                init: function(name, position, grade) {
                    var that = this;
                    that.name = name;
                    that.position = position;
                    that.grade = grade;
                    that.typeName = 'Employee';

                    return this;
                },
                set name(value) {
                    Validators.validateNonEmptyString(value);
                    this._name = value;
                },
                get name() {
                    return this._name;
                },
                set position(value) {
                    Validators.validateNonEmptyString(value);
                    this._position = value;
                },
                get position() {
                    return this._position;
                },
                set grade(value) {
                    Validators.validateNonNegativeInteger(value);
                    this._grade = value;
                },
                get grade() {
                    return this._grade;
                },
                toString: function() {
                    return ' ---> ' + this.name + ',position=' + this.position;
                }
            };

            return Employee;
        })();

        var Vehicle = (function() {
            var Vehicle = {
                init: function(brand, age, terrainCoverage, numberOfWheels) {
                    var that = this;
                    that.brand = brand;
                    that.age = age;
                    that.terrainCoverage = terrainCoverage;
                    that.numberOfWheels = numberOfWheels;

                    return that;
                },
                set brand(value) {
                    Validators.validateNonEmptyString(value);
                    this._brand = value;
                },
                get brand() {
                    return this._brand;
                },
                set age(value) {
                    Validators.validateNonNegativeNumber(value);
                    this._age = value;
                },
                get age() {
                    return this._age;
                },
                set terrainCoverage(value) {
                    Validators.validateNonEmptyString(value);
                    if (!(value === 'all' || value === 'road')) {
                        throw new Error('Vehicle terrain coverage can be either “road” or “all”');
                    }

                    this._terrainCoverage = value;
                },
                get terrainCoverage() {
                    return this._terrainCoverage;
                },
                set numberOfWheels(value) {
                    Validators.validateNonNegativeInteger(value);
                    this._numberOfWheels = value;
                },
                get numberOfWheels() {
                    return this._numberOfWheels;
                },
                toString: function() {
                    return ' -> ' + this.typeName + ': ' +
                        'brand=' + this.brand +
                        ',age=' + this.age.toFixed(1) +
                        ',terrainCoverage=' + this.terrainCoverage +
                        ',numberOfWheels=' + this.numberOfWheels;
                }
            };

            return Vehicle;
        })();

        var Bike = (function(parent) {
            var Bike = Object.create(Vehicle, {
                init: {
                    value: function(brand, age, terrainCoverage, frameSize, numberOfShifts) {
                        var that = this;
                        parent.init.call(this, brand, age, terrainCoverage, 2);
                        that.frameSize = frameSize;
                        that.numberOfShifts = numberOfShifts;
                        that.typeName = 'Bike';

                        return that;
                    }
                },
                frameSize: {
                    set: function(value) {
                        Validators.validateNonNegativeNumber(value);
                        this._frameSize = value;
                    },
                    get: function() {
                        return this._frameSize;
                    }
                },
                numberOfShifts: {
                    set: function(value) {
                        if (value) {
                            Validators.validateNonEmptyString(value);
                        }

                        this._numberOfShifts = value;
                    },
                    get: function() {
                        return this._numberOfShifts;
                    }
                },
                toString: {
                    value: function() {
                        var numberOfShiftsText = this.numberOfShifts ? ',numberOfShifts=' + this.numberOfShifts : '';
                        return parent.toString.call(this) +
                            ',frameSize=' + this.frameSize +
                            numberOfShiftsText;
                    }
                }
            });

            return Bike;
        })(Vehicle);

        var Automobile = (function(parent) {
            var Automobile = Object.create(Vehicle, {
                init: {
                    value: function(brand, age, terrainCoverage, numberOfWheels, consumption, fuel) {
                        var that = this;
                        parent.init.call(this, brand, age, terrainCoverage, numberOfWheels);
                        that.consumption = consumption;
                        that.fuel = fuel;

                        return that;
                    }
                },
                consumption: {
                    set: function(value) {
                        Validators.validateNonNegativeNumber(value);
                        this._consumption = value;
                    },
                    get: function() {
                        return this._consumption;
                    }
                },
                fuel: {
                    set: function(value) {
                        Validators.validateNonEmptyString(value);
                        this._fuel = value;
                    },
                    get: function() {
                        return this._fuel;
                    }
                },
                toString: {
                    value: function() {
                        return parent.toString.call(this) +
                            ',consumption=[' + this.consumption +
                            'l/100km ' + this.fuel + ']';
                    }
                }
            });

            return Automobile;
        })(Vehicle);

        var Truck = (function(parent) {
            var Truck = Object.create(Automobile, {
                init: {
                    value: function(brand, age, terrainCoverage, consumption, fuel, numberOfDoors) {
                        var that = this;
                        parent.init.call(that, brand, age, terrainCoverage || 'all', 4, consumption, fuel);
                        that.numberOfDoors = numberOfDoors;
                        that.typeName = 'Truck';

                        return that;
                    }
                },
                numberOfDoors: {
                    set: function(value) {
                        Validators.validateNonNegativeInteger(value);
                        this._numberOfDoors = value;
                    },
                    get: function() {
                        return this._numberOfDoors;
                    }
                },
                toString: {
                    value: function() {
                        return parent.toString.call(this) + ',numberOfDoors=' + this.numberOfDoors;
                    }
                }
            });

            return Truck;
        })(Automobile);

        var Limo = (function(parent) {
            var Limo = Object.create(Automobile, {
                init: {
                    value: function(brand, age, numberOfWheels, consumption, fuel) {
                        var that = this;
                        parent.init.call(that, brand, age, 'road', numberOfWheels, consumption, fuel);
                        that._employees = [];
                        that.typeName = 'Limo';

                        return that;
                    }
                },
                appendEmployee: {
                    value: function(value) {
                        var containsEmployee;

                        if (value === undefined || !Employee.isPrototypeOf(value)) {
                            throw new Error('Invalid employee argument');
                        }

                        containsEmployee = (this._employees).some(function(item) {
                            return item.name === value.name;
                        });
                        if (!containsEmployee) {
                            this._employees.push(value);
                        }
                    }
                },
                detachEmployee: {
                    value: function(value) {
                        var len = this._employees.length;
                        if (value === undefined || !Employee.isPrototypeOf(value)) {
                            throw new Error('Invalid employee argument');
                        }
                        this._employees = this._employees.filter(function(item){
                            return item.name !== value.name;
                        });
                    }
                },
                toString: {
                    value: function() {
                        return parent.toString.call(this) + '\n' + getEmployeesText(this);
                    }
                }
            });

            function getEmployeesText(that) {
                var newLineText = that._employees.length ? '\n' : '';
                return ' --> Employees, allowed to drive:' + newLineText + (that._employees.join('\n') || ' ---');
            }

            return Limo;
        })(Automobile);

        return {
            Employee: Employee,
            Bike: Bike,
            Truck: Truck,
            Limo: Limo
        };
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
                        object = Object.create(Models.Bike)
                            .init(
                                command["brand"],
                                parseFloat(command["age"]),
                                command["terrain-coverage"],
                                parseFloat(command["frame-size"]),
                                command["number-of-shifts"]);
                        _vehicles.push(object);
                        break;
                    case "truck":
                        object = Object.create(Models.Truck)
                            .init(
                                command["brand"],
                                parseFloat(command["age"]),
                                command["terrain-coverage"],
                                parseFloat(command["consumption"]),
                                command["type-of-fuel"],
                                parseFloat(command["number-of-doors"]));
                        _vehicles.push(object);
                        break;
                    case "limo":
                        object = Object.create(Models.Limo)
                            .init(
                                command["brand"],
                                parseFloat(command["age"]),
                                parseFloat(command["number-of-wheels"]),
                                parseFloat(command["consumption"]),
                                command["type-of-fuel"]);
                        _vehicles.push(object);
                        break;
                    case "employee":
                        object = Object.create(Models.Employee)
                            .init(command["name"], command["position"], parseFloat(command["grade"]));
                        _employees.push(object);
                        break;
                    default:
                        throw new Error("Invalid type.");
                }

                return object.typeName + " created.";
            }

            function processDeleteCommand(command) {
                var object,
                    index;

                switch (command["type"]) {
                    case "employee":
                        object = getEmployeeByName(command["name"]);
                        _vehicles.forEach(function(t) {
                            if (t instanceof Models.Limo && t.employees.indexOf(object) !== -1) {
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

                return object.typeName + " deleted.";
            }

            function processListCommand(command) {
                return formatOutputList(_vehicles);
            }

            function processListEmployees(command) {
                var minGrade;
                if (command.grade !== 'all') {
                    minGrade = Number(command.grade);
                } else {
                    minGrade = 0;
                }

                Validators.validateNonNegativeNumber(minGrade);

                var selectedEmployees = _employees.filter(function(item) {
                    return item.grade >= minGrade;
                }).sort(function(a, b) {
                    return a.name.localeCompare(b.name);
                });

                return formatOutputList(selectedEmployees);
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
                    if (_vehicles[i].typeName.toLowerCase() === type &&
                        _vehicles[i].brand === brand) {
                        return _vehicles[i];
                    }
                }
                throw new Error("No Limo with such brand exists.");
            }

            function getLimosByBrand(brand) {
                var currentVehicles = [];
                for (var i = 0; i < _vehicles.length; i++) {
                    if (Models.Limo.isPrototypeOf(_vehicles[i]) &&
                        _vehicles[i].brand === brand) {
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
                    if (_employees[i].name === name) {
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
                //result = e.message + "\n";
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