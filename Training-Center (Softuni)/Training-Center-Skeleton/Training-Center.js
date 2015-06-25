function processTrainingCenterCommands(commands) {

    'use strict';

    var Validators = (function() {
        return {
            NonEmptyStringMandatory: function(str, strInfo) {
                if (!str) {
                    throw new Error('Invalid undefined string: ' + strInfo);
                };
                if (str == '') {
                    throw new Error('Invalid empty string: ' + strInfo);
                };
            },
            NonEmptyStringNonMandatory: function(str, strInfo) {
                if (str == '') {
                    throw new Error('Invalid empty string: ' + strInfo);
                };
            },
            validateEmail: function(email, info) {
                if (email) {
                    if (email.indexOf('@') == -1) {
                        throw new Error('Email must contain @: ' + info);
                    };
                };
            },
            validateIntInRangeNonMandatory: function(int, min, max, info) {
                if (int) {
                    if (isNaN(int)) {
                        throw new Error('Invalid not a number: ' + info);
                    };
                    if (int < min || int > max) {
                        throw new Error('Number must be in the range ' + min + ' to ' + max + ': ' + info);
                    };
                };
            },
            validateDate: function(y, m, d, info) {
                if (isNaN(y)) {
                    throw new Error('Year must be a number: ' + info);
                };
                if (isNaN(m)) {
                    throw new Error('Month must be a number: ' + info);
                };
                if (isNaN(d)) {
                    throw new Error('Date must be a number: ' + info);
                };

                var year = parseInt(y);
                var month = parseInt(m);
                var date = parseInt(d);

                var newDate = new Date(year, month, date);
                if (newDate.getFullYear() != year ||
                    newDate.getMonth() != month ||
                    newDate.getDate != date) {
                    throw new Error('Invalid date ' + year + '-' + month + '-' + date + ': ' + info);
                };
            },
            validateDateInRange: function(date, min, max, info) {
                // Validators.validateDate(date);
                if (date < min || date > max) {
                    throw new Error('Date out of range: ' + info);
                };
            },
            validateTrainer: function(trainer, info) {
                if (trainer) {                    
                    if (trainer.constructor.name != 'Trainer') {
                        throw new Error('Invalid trainer: ' + info);
                    };
                };
            }
        };
    }());

    var trainingcenter = (function() {

        var TrainingCenterEngine = (function() {

            var _trainers;
            var _uniqueTrainerUsernames;
            var _trainings;

            function initialize() {
                _trainers = [];
                _uniqueTrainerUsernames = {};
                _trainings = [];
            }

            function executeCommand(command) {
                var cmdParts = command.split(' ');
                var cmdName = cmdParts[0];
                var cmdArgs = cmdParts.splice(1);
                switch (cmdName) {
                    case 'create':
                        return executeCreateCommand(cmdArgs);
                    case 'list':
                        return executeListCommand();
                    case 'delete':
                        return executeDeleteCommand(cmdArgs);
                    default:
                        throw new Error('Unknown command: ' + cmdName);
                }
            }

            function executeCreateCommand(cmdArgs) {
                var objectType = cmdArgs[0];
                var createArgs = cmdArgs.splice(1).join(' ');
                var objectData = JSON.parse(createArgs);
                var trainer;
                switch (objectType) {
                    case 'Trainer':
                        trainer = new trainingcenter.Trainer(objectData.username, objectData.firstName,
                            objectData.lastName, objectData.email);
                        addTrainer(trainer);
                        break;
                    case 'Course':
                        trainer = findTrainerByUsername(objectData.trainer);
                        var course = new trainingcenter.Course(objectData.name, objectData.description, trainer,
                            parseDate(objectData.startDate), objectData.duration);
                        addTraining(course);
                        break;
                    case 'Seminar':
                        trainer = findTrainerByUsername(objectData.trainer);
                        var seminar = new trainingcenter.Seminar(objectData.name, objectData.description,
                            trainer, parseDate(objectData.date));
                        addTraining(seminar);
                        break;
                    case 'RemoteCourse':
                        trainer = findTrainerByUsername(objectData.trainer);
                        var remoteCourse = new trainingcenter.RemoteCourse(objectData.name, objectData.description,
                            trainer, parseDate(objectData.startDate), objectData.duration, objectData.location);
                        addTraining(remoteCourse);
                        break;
                    default:
                        throw new Error('Unknown object to create: ' + objectType);
                }
                return objectType + ' created.';
            }

            function findTrainerByUsername(username) {
                if (!username) {
                    return undefined;
                }
                for (var i = 0; i < _trainers.length; i++) {
                    if (_trainers[i].getUsername() == username) {
                        return _trainers[i];
                    }
                }
                throw new Error("Trainer not found: " + username);
            }

            function addTrainer(trainer) {
                if (_uniqueTrainerUsernames[trainer.getUsername()]) {
                    throw new Error('Duplicated trainer: ' + trainer.getUsername());
                }
                _uniqueTrainerUsernames[trainer.getUsername()] = true;
                _trainers.push(trainer);
            }

            function addTraining(training) {
                _trainings.push(training);
            }

            function executeListCommand() {
                var result = '',
                    i;
                if (_trainers.length > 0) {
                    result += 'Trainers:\n' + ' * ' + _trainers.join('\n * ') + '\n';
                } else {
                    result += 'No trainers\n';
                }

                if (_trainings.length > 0) {
                    result += 'Trainings:\n' + ' * ' + _trainings.join('\n * ') + '\n';
                } else {
                    result += 'No trainings\n';
                }

                return result.trim();
            }

            function executeDeleteCommand(cmdArgs) {
                var objectType = cmdArgs[0];
                var deleteArgs = cmdArgs.splice(1).join(' ');
                switch (objectType) {
                    case 'Trainer':

                        throw new Error('Command "delete Trainer" not implemented.');
                        break;
                    default:
                        throw new Error('Unknown object to delete: ' + objectType);
                }
                return objectType + ' deleted.';
            }

            var trainingCenterEngine = {
                initialize: initialize,
                executeCommand: executeCommand
            };
            return trainingCenterEngine;
        }());


        // TODO: implement Trainer class
        var Trainer = (function() {
            function Trainer(username, firstName, lastName, email) {
                this.setUserName(username);
                this.setFirstName(firstName);
                this.setLastName(lastName);
                this.setEmail(email);
            }

            Trainer.prototype.getEmail = function() {
                return this._email;
            };
            Trainer.prototype.getFirstName = function() {
                return this._firstName;
            };
            Trainer.prototype.getLastName = function() {
                return this._lastName;
            };
            Trainer.prototype.getUsername = function() {
                return this._userName;
            };
            Trainer.prototype.setEmail = function(value) {
                Validators.validateEmail(value, 'Trainer email');
                this._email = value;
            };
            Trainer.prototype.setFirstName = function(value) {
                Validators.NonEmptyStringNonMandatory(value, 'Trainer firstName');
                this._firstName = value;
            };
            Trainer.prototype.setLastName = function(value) {
                Validators.NonEmptyStringMandatory(value, 'Trainer lastName');
                this._lastName = value;
            };
            Trainer.prototype.setUserName = function(value) {
                Validators.NonEmptyStringMandatory(value, 'Trainer username');
                this._userName = value;
            };

            return Trainer;
        }());


        // TODO: implement Training class
        var Training = (function() {
            function Training(name, description, trainer, startDate, duration) {
                this.setName(name);
                this.setDescription(description);
                this.setTrainer(trainer);
                this.setStartDate(startDate);
                this.setDuration(duration);
            }

            Training.prototype.getDescription = function() {
                return this._description;
            };
            Training.prototype.getDuration = function() {
                return this._duration;
            };
            Training.prototype.getName = function() {
                return this._name;
            };
            Training.prototype.getStartDate = function() {
                return this._startDate;
            };
            Training.prototype.getTrainer = function() {
                return this._trainer;
            };
            Training.prototype.setDescription = function(value) {
                Validators.NonEmptyStringNonMandatory(value, 'Training description');
                this._description = value;
            };
            Training.prototype.setDuration = function(value) {
                Validators.validateIntInRangeNonMandatory(value, 1, 99, 'Training duration');
                this._duration = Number(value);
            };
            Training.prototype.setName = function(value) {
                Validators.NonEmptyStringMandatory(value, 'Training.setName');
                this._name = value;
            };
            Training.prototype.setStartDate = function(value) {
                Validators.validateDateInRange(value,
                    new Date(2014,2,29),
                    new Date(2015,11,31),
                    'Training.prototype.setStartDate');

                this._startDate = value;
            };
            Training.prototype.setTrainer = function(value) {
                Validators.validateTrainer(value, 'Training.prototype.setTrainer');
                this._trainer = value;
            };

            function parseDate(val) {
                var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var splitDate = val.split(/\-/g);
                var y = parseInt(splitDate[2]);
                var m = MONTHS.indexOf(splitDate[1]);
                var d = parseInt(splitDate[0]);

                return new Date(y, m, d);
            }

            return Training;
        }());


        // TODO: implement Course class
        var Course = (function() {
            function Course(name, description, trainer, startDate, duration) {
                Training.call(this, name, description, trainer, startDate, duration);
            }

            Course.prototype = Object.create(Training.prototype);
            Course.prototype.constructor = Course;

            return Course;
        }());


        // TODO: implement Seminar class
        var Seminar = (function() {
            function Seminar(name, description, trainer, startDate, duration) {
                Training.call(this, name, description, trainer, startDate, duration);
            }

            Seminar.prototype = Object.create(Training.prototype);
            Seminar.prototype.constructor = Seminar;

            return Seminar;
        }());


        // TODO: implement RemoteCourse class
        var RemoteCourse = (function() {
            function RemoteCourse(name, description, trainer, startDate, duration, location) {
                Training.call(this, name, description, trainer, startDate, duration);
                this.setLocation(location);
            }

            RemoteCourse.prototype = Object.create(Training.prototype);
            RemoteCourse.prototype.constructor = RemoteCourse;

            RemoteCourse.prototype.getLocation = function() {
                return this._location;
            };
            RemoteCourse.prototype.setLocation = function(value) {
                Validators.NonEmptyStringMandatory(value);
                this._location = value;
            };

            return RemoteCourse;
        }());


        var trainingcenter = {
            Trainer: Trainer,
            Course: Course,
            Seminar: Seminar,
            RemoteCourse: RemoteCourse,
            engine: {
                TrainingCenterEngine: TrainingCenterEngine
            }
        };

        return trainingcenter;
    })();


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


    // Process the input commands and return the results
    var results = '';
    trainingcenter.engine.TrainingCenterEngine.initialize();
    commands.forEach(function(cmd) {
        if (cmd != '') {
            try {
                var cmdResult = trainingcenter.engine.TrainingCenterEngine.executeCommand(cmd);
                results += cmdResult + '\n';
            } catch (err) {
                console.log(err.message);
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
    var arr = [];
    if (typeof(require) == 'function') {
        // We are in node.js --> read the console input and process it
        require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        }).on('line', function(line) {
            arr.push(line);
        }).on('close', function() {
            console.log(processTrainingCenterCommands(arr));
        });
    }
})();