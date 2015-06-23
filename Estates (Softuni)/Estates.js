function processEstatesAgencyCommands(commands) {

    'use strict';

    var Validators = (function() {
        function validateInt(val, min, max) {
            if (isNaN(val)) {
                throw Error('Invalid number format');
            };

            if (isNaN(min)) {
                throw Error('Invalid min format');
            };

            if (isNaN(max)) {
                throw Error('Invalid max format');
            };

            if (val < min || val > max) {
                throw Error('Number is out of the allowed range [' + min + ', ' + max + ']');
            };
        }

        function validateString(str) {
            if (typeof(str) != 'string') {
                throw Error('Invalid string');
            };

            if (str == '') {
                throw new Error('Invalid empty string');
            };
        }

        function validateBoolean(bool) {
            if (typeof(parseBoolean(bool)) != 'boolean') {
                throw new Error('Invalid boolean value');
            };
        }

        function validateEstate(estate) {
            if (!(findEstateByName(estate))) {
                throw new Error('Estate not found');
            };
        }

        function validatePositiveInt(val) {
            if (isNaN(val)) {
                throw new Error('Invalid number');
            };

            if (Number(val) % 1 !== 0) {
                throw new Error('Number is not an integer');
            };
        }

        return {
            validateInt: validateInt,
            validateString: validateString,
            validateBoolean: validateBoolean,
            validateEstate: validateEstate,
            validatePositiveInt: validatePositiveInt
        }
    }());


    var Estate = (function() {
        function Estate(name, area, location, isFurnitured) {
            this.setName(name);
            this.setArea(area);
            this.setLocation(location);
            this.setIsFurnitured(isFurnitured);
        }

        Estate.prototype.setName = function(name) {
            Validators.validateString(name);
            this._name = name;
        };

        Estate.prototype.getName = function() {
            return this._name;
        };

        Estate.prototype.setArea = function(area) {
            Validators.validateInt(area, 1, 10000);
            this._area = area;
        };

        Estate.prototype.getArea = function() {
            return this._area;
        };

        Estate.prototype.getLocation = function() {
            return this._location;
        };

        Estate.prototype.setLocation = function(location) {
            Validators.validateString(location);
            this._location = location;
        };

        Estate.prototype.setIsFurnitured = function(isFurnitured) {
            // Validators.validateBoolean(isFurnitured);
            this._isFurnitured = isFurnitured;
        };

        Estate.prototype.getIsFurnitured = function() {
            // Validators.validateBoolean(isFurnitured);
            return this._isFurnitured;
        };

        Estate.prototype.toString = function() {
            var furnituredStr = this.getIsFurnitured() ? 'Yes' : 'No';
            return this.constructor.name + ': Name = ' + this.getName() + ', Area = ' + this.getArea() + ', Location = ' + this.getLocation() + ', Furnitured = ' + furnituredStr;
        };

        return Estate;
    }());


    var BuildingEstate = (function() {
        function BuildingEstate(name, area, location, isFurnitured, rooms, hasElevator) {
            Estate.call(this, name, area, location, isFurnitured);
            this.setRooms(rooms);
            this.setHasElevator(hasElevator);
        }

        BuildingEstate.prototype = Object.create(Estate.prototype);
        BuildingEstate.prototype.constructor = BuildingEstate;

        BuildingEstate.prototype.setRooms = function(rooms) {
            Validators.validateInt(rooms, 0, 100);
            this._rooms = rooms;
        }

        BuildingEstate.prototype.getRooms = function() {
            return this._rooms;
        }

        BuildingEstate.prototype.setHasElevator = function(hasElevator) {
            // Validators.validateBoolean(hasElevator);
            this._hasElevator = hasElevator;
        }

        BuildingEstate.prototype.getHasElevator = function() {
            return this._hasElevator;
        }

        BuildingEstate.prototype.toString = function() {
            var elevatorStr = this.getHasElevator() ? 'Yes' : 'No';
            return Estate.prototype.toString.call(this) + ', Rooms: ' + this.getRooms() + ', Elevator: ' + elevatorStr;
        };

        return BuildingEstate;
    }());


    var Apartment = (function() {
        function Apartment(name, area, location, isFurnitured, rooms, hasElevator) {
            BuildingEstate.call(this, name, area, location, isFurnitured, rooms, hasElevator);
        }

        Apartment.prototype = Object.create(BuildingEstate.prototype);
        Apartment.prototype.constructor = Apartment;

        Apartment.prototype.toString = function() {
            return BuildingEstate.prototype.toString.call(this);
        };

        return Apartment;
    }());


    var Office = (function() {
        function Office(name, area, location, isFurnitured, rooms, hasElevator) {
            BuildingEstate.call(this, name, area, location, isFurnitured, rooms, hasElevator);
        }

        Office.prototype = Object.create(BuildingEstate.prototype);
        Office.prototype.constructor = Office;

        return Office;
    }());


    var House = (function() {
        function House(name, area, location, isFurnitured, floors) {
            Estate.call(this, name, area, location, isFurnitured);
            this.setFloors(floors);
        }

        House.prototype = Object.create(Estate.prototype);
        House.prototype.constructor = House;

        House.prototype.setFloors = function(floors) {
            Validators.validateInt(floors, 1, 10);
            this._floors = floors;
        };

        House.prototype.getFloors = function(floors) {
            return this._floors;
        };

        House.prototype.toString = function() {
            return Estate.prototype.toString.call(this) + ', Floors: ' + this.getFloors();
        };

        return House;
    }());

    var Garage = (function() {
        function Garage(name, area, location, isFurnitured, width, height) {
            Estate.call(this, name, area, location, isFurnitured);
            this.setWidth(width);
            this.setHeight(height);
        }

        Garage.prototype = Object.create(Estate.prototype);
        Garage.prototype.constructor = Garage;

        Garage.prototype.setWidth = function(width) {
            Validators.validateInt(width, 1, 500);
            this._width = width;
        };

        Garage.prototype.getWidth = function() {
            return this._width;
        }

        Garage.prototype.setHeight = function(height) {
            Validators.validateInt(height, 1, 500);
            this._height = height;
        };

        Garage.prototype.getHeight = function() {
            return this._height;
        }

        Garage.prototype.toString = function() {
            return Estate.prototype.toString.call(this) + ', Width: ' + this.getWidth() + ', Height: ' + this.getHeight();
        };

        return Garage;
    }());


    var Offer = (function() {
        function Offer(estate, price) {
            this.setEstate(estate);
            this.setPrice(price);
        }

        Offer.prototype.setEstate = function(estate) {
            // Validators.validateEstate(estate);
            this._estate = estate;
        }

        Offer.prototype.getEstate = function() {
            return this._estate;
        }

        Offer.prototype.setPrice = function(price) {
            Validators.validatePositiveInt(price);
            this._price = price;
        }

         Offer.prototype.getPrice = function(price) {
            return this._price;
        }

        Offer.prototype.toString = function(){
             var estate = this.getEstate();
             var thisOffer = this;

            var type = function(){
                if (thisOffer.constructor.name == 'RentOffer') {
                    return 'Rent';
                };

                if (thisOffer.constructor.name == 'SaleOffer') {
                    return 'Sale';
                };

                throw Error ('Undefined offer type');
            }();

           

            return type + ': Estate = ' + estate.getName() + ', Location = ' + estate.getLocation() + ', Price = ' + this.getPrice();
        };

        return Offer;
    }());


    var RentOffer = (function() {
        function RentOffer(estate, price) {
            Offer.call(this, estate, price);
        }

        RentOffer.prototype = Object.create(Offer.prototype);
        RentOffer.prototype.constructor = RentOffer;

        return RentOffer;
    }());


    var SaleOffer = (function() {
        function SaleOffer(estate, price) {
            Offer.call(this, estate, price);
        }

        SaleOffer.prototype = Object.create(Offer.prototype);
        SaleOffer.prototype.constructor = SaleOffer;

        return SaleOffer;
    }());


    var EstatesEngine = (function() {
        var _estates;
        var _uniqueEstateNames;
        var _offers;

        function initialize() {
            _estates = [];
            _uniqueEstateNames = {};
            _offers = [];
        }

        function executeCommand(command) {
            var cmdParts = command.split(' ');
            var cmdName = cmdParts[0];
            var cmdArgs = cmdParts.splice(1);
            switch (cmdName) {
                case 'create':
                    return executeCreateCommand(cmdArgs);
                case 'status':
                    return executeStatusCommand();
                case 'find-sales-by-location':
                    return executeFindSalesByLocationCommand(cmdArgs[0]);
                default:
                    throw new Error('Unknown command: ' + cmdName);
            }
        }

        function executeCreateCommand(cmdArgs) {
            var objType = cmdArgs[0];
            switch (objType) {
                case 'Apartment':
                    var apartment = new Apartment(cmdArgs[1], Number(cmdArgs[2]), cmdArgs[3],
                        parseBoolean(cmdArgs[4]), Number(cmdArgs[5]), parseBoolean(cmdArgs[6]));
                    addEstate(apartment);
                    break;
                case 'Office':
                    var office = new Office(cmdArgs[1], Number(cmdArgs[2]), cmdArgs[3],
                        parseBoolean(cmdArgs[4]), Number(cmdArgs[5]), parseBoolean(cmdArgs[6]));
                    addEstate(office);
                    break;
                case 'House':
                    var house = new House(cmdArgs[1], Number(cmdArgs[2]), cmdArgs[3],
                        parseBoolean(cmdArgs[4]), Number(cmdArgs[5]));
                    addEstate(house);
                    break;
                case 'Garage':
                    var garage = new Garage(cmdArgs[1], Number(cmdArgs[2]), cmdArgs[3],
                        parseBoolean(cmdArgs[4]), Number(cmdArgs[5]), Number(cmdArgs[6]));
                    addEstate(garage);
                    break;
                case 'RentOffer':
                    var estate = findEstateByName(cmdArgs[1]);
                    var rentOffer = new RentOffer(estate, Number(cmdArgs[2]));
                    addOffer(rentOffer);
                    break;
                case 'SaleOffer':
                    estate = findEstateByName(cmdArgs[1]);
                    var saleOffer = new SaleOffer(estate, Number(cmdArgs[2]));
                    addOffer(saleOffer);
                    break;
                case 'find-rents-by-location location':
                // TODO: Modify the engine (EstatesEngine) to implement support for the command
                    break;
                case 'find-rents-by-price minPrice maxPrice':
                // TODO: Modify the engine (EstatesEngine) to implement support for the command
                    break;
                default:
                    throw new Error('Unknown object to create: ' + objType);
            }
            return objType + ' created.';
        }

        function parseBoolean(value) {
            switch (value) {
                case "true":
                    return true;
                case "false":
                    return false;
                default:
                    throw new Error("Invalid boolean value: " + value);
            }
        }

        function findEstateByName(estateName) {
            for (var i = 0; i < _estates.length; i++) {
                if (_estates[i].getName() == estateName) {
                    return _estates[i];
                }
            }
            return undefined;
        }

        function addEstate(estate) {
            if (_uniqueEstateNames[estate.getName()]) {
                throw new Error('Duplicated estate name: ' + estate.getName());
            }
            _uniqueEstateNames[estate.getName()] = true;
            _estates.push(estate);
        }

        function addOffer(offer) {
            _offers.push(offer);
        }

        function executeStatusCommand() {
            var result = '',
                i;
            if (_estates.length > 0) {
                result += 'Estates:\n';
                for (i = 0; i < _estates.length; i++) {
                    result += "  " + _estates[i].toString() + '\n';
                }
            } else {
                result += 'No estates\n';
            }

            if (_offers.length > 0) {
                result += 'Offers:\n';
                for (i = 0; i < _offers.length; i++) {
                    result += "  " + _offers[i].toString() + '\n';
                }
            } else {
                result += 'No offers\n';
            }

            return result.trim();
        }

        function executeFindSalesByLocationCommand(location) {
            if (!location) {
                throw new Error("Location cannot be empty.");
            }
            var selectedOffers = _offers.filter(function(offer) {
                return offer.getEstate().getLocation() === location &&
                    offer instanceof SaleOffer;
            });
            selectedOffers.sort(function(a, b) {
                return a.getEstate().getName().localeCompare(b.getEstate().getName());
            });
            return formatQueryResults(selectedOffers);
        }

        function formatQueryResults(offers) {
            var result = '';
            if (offers.length == 0) {
                result += 'No Results\n';
            } else {
                result += 'Query Results:\n';
                for (var i = 0; i < offers.length; i++) {
                    var offer = offers[i];
                    result += '  [Estate: ' + offer.getEstate().getName() +
                        ', Location: ' + offer.getEstate().getLocation() +
                        ', Price: ' + offer.getPrice() + ']\n';
                }
            }
            return result.trim();
        }

        return {
            initialize: initialize,
            executeCommand: executeCommand
        };
    }());


    // Process the input commands and return the results
    var results = '';
    EstatesEngine.initialize();
    commands.forEach(function(cmd) {
        if (cmd != '') {
            try {
                var cmdResult = EstatesEngine.executeCommand(cmd);
                results += cmdResult + '\n';
            } catch (err) {
                //console.log(err);
                results += 'Invalid command.\n';
            }
        }
    });
    return results.trim();

}

// ------------------------------------------------------------
// Read the input from the console as array and process it
// Remove all below code before submitting to the judge system!
// ------------------------------------------------------------

(function() {
    var arr = [

    ];
    if (typeof(require) == 'function') {
        // We are in node.js --> read the console input and process it
        require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        }).on('line', function(line) {
            arr.push(line);
        }).on('close', function() {
            console.log(processEstatesAgencyCommands(arr));
        });
    }
})();