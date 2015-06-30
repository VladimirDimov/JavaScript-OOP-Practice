function processTrainingCenterCommands(commands) {

    'use strict';

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
                        trainer = Object.create(Trainer)
                            .init(objectData.username, objectData.firstName, objectData.lastName, objectData.email);
                        addTrainer(trainer);
                        break;
                    case 'Course':
                        trainer = findTrainerByUsername(objectData.trainer);
                        var course = Object.create(Course)
                            .init(objectData.name, objectData.description, trainer, parseDate(objectData.startDate), objectData.duration);
                        addTraining(course);
                        break;
                    case 'Seminar':
                        trainer = findTrainerByUsername(objectData.trainer);
                        var seminar = Object.create(Seminar)
                            .init(objectData.name, objectData.description, trainer, parseDate(objectData.date));
                        addTraining(seminar);
                        break;
                    case 'RemoteCourse':
                        trainer = findTrainerByUsername(objectData.trainer);
                        var remoteCourse = Object.create(RemoteCourse)
                            .init(objectData.name, objectData.description, trainer, parseDate(objectData.startDate), objectData.duration, objectData.location);
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
                        // TODO: implement "delete Trainer" command
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

        var Validators = {
            validateNonEmptyStrings: function(value) {
                if (!value || (typeof value != 'string') || value === '') {
                    throw new Error('Invalid non empty string');
                }
            },
            validateDateInRange: function(date, minDate, maxDate) {
                if (date < minDate || date > maxDate) {
                    throw new Error('Date is out of allowed range.');
                }
            },
            validateIntInRange: function(value, min, max) {
                if ((typeof value !== 'number') || value < min || value > max) {
                    throw new Error('Number out of allowed range.');
                }
            },
            validateEmail: function(value){
                if (typeof value !== 'string' || value.indexOf('@') == -1) {
                    throw new Error('Invalid email format');
                }
            },
            validateTrainer: function(value){
                if (value.type && value.type !== 'Trainer') {
                    throw new Error('Invalid trainer');
                }
            }
        };

        // TODO: implement Trainer class
        var Trainer = (function() {
            var Trainer = {
                init: function(username, firstName, lastName, email) {
                    this.setUsername(username);
                    this.setFirstName(firstName);
                    this.setLastName(lastName);
                    this.setEmail(email);

                    return this;
                },
                getMail: function() {
                    return this._email;
                },
                getFirstName: function() {
                    return this._firstName;
                },
                getLastName: function() {
                    return this._lastName;
                },
                getUsername: function() {
                    return this._userName;
                },
                setEmail: function(value) {
                    if (value) {
                        Validators.validateEmail(value);
                    };
                    this._email = value;
                },
                setFirstName: function(value) {
                    if (value) {
                        Validators.validateNonEmptyStrings(value);
                    };
                    this._firstName = value;
                },
                setLastName: function(value) {
                    Validators.validateNonEmptyStrings(value);
                    this._lastName = value;
                },
                setUsername: function(value) {
                    Validators.validateNonEmptyStrings(value);
                    this._userName = value;
                }
            };

            Object.defineProperty(Trainer, 'type', {
                value: 'Trainer'
            });

            return Trainer;
        }());


        // TODO: implement Training class
        var Training = (function() {
            var Training = {
                init: function(name, description, trainer, startDate, duration) {
                    this.setName(name);
                    this.setDescription(description);
                    this.setTrainer(trainer);
                    this.setStartDate(startDate);
                    this.setDuration(duration);

                    return this;
                },
                setName: function(value) {
                    Validators.validateNonEmptyStrings(value);
                    this._name = value;
                },
                getName: function() {
                    return this._name;
                },
                setDescription: function(value) {
                    if (value) {
                        Validators.validateNonEmptyStrings(value);
                    }

                    this._description = value;
                },
                getDescription: function() {
                    return this._description;
                },
                setTrainer: function(value) {
                    if (value) {
                        Validators.validateTrainer(value);
                    }

                    this._trainer = value;
                },
                getTrainer: function() {
                    return this._trainer;
                },
                setStartDate: function(value) {
                    Validators.validateDateInRange(value, new Date(2000,1,1), new Date(2020, 12, 31));
                    this._startDate = value;
                },
                getDate: function() {
                    return this._startDate;
                },
                setDuration: function(value) {
                    if (value) {
                        Validators.validateIntInRange(value, 1, 99);
                    }

                    this._duration = value;
                },
                getDuration: function() {
                    return this._duration;
                }
            };

            return Training;
        }());


        // TODO: implement Course class
        var Course = (function() {
            var Course = Object.create(Training);

            Object.defineProperty(Course, 'init', {
                value: function(name, description, trainer, startDate, duration) {
                    Training.init.call(this, name, description, trainer, startDate, duration);
                    return this;
                }
            });

            Object.defineProperty(Course, 'type', {
                writable: false,
                value: 'Course'
            });

            return Course;
        }());


        // TODO: implement Seminar class
        var Seminar = (function() {
            var Seminar = Object.create(Training);

            Object.defineProperty(Seminar, 'init', {
                value: function(name, description, trainer, startDate, duration) {
                    Training.init.call(this, name, description, trainer, startDate, duration);
                    return this;
                }
            });

            Object.defineProperty(Seminar, 'type', {
                value: 'Seminar'
            });

            return Seminar;
        }());


        // TODO: implement RemoteCourse class
        var RemoteCourse = (function() {
            var RemoteCourse = Object.create(Course);

            Object.defineProperty(RemoteCourse, 'init', {
                value: function(name, description, trainer, startDate, duration, location) {
                    Course.init.call(this, name, description, trainer, startDate, duration);
                    this.setLocation(location);

                    return this;
                }
            });

            Object.defineProperty(RemoteCourse, 'setLocation', {
                value: function(value) {
                    Validators.validateNonEmptyStrings(value);
                    this._location = value;
                }
            });
            Object.defineProperty(RemoteCourse, 'getLocation', {
                value: function(value) {
                    return this._location;
                }
            });
            Object.defineProperty(RemoteCourse, 'type', {
                value: 'RemoteCourse'
            });

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
        if (dateStr !== dateFormatted) {
            throw new Error("Invalid date: " + dateStr);
        }
        return date;
    };


    var formatDate = function(date) {
        var day = date.getDate();
        var monthName = date.toString().split(' ')[1];
        var year = date.getFullYear();
        return day + '-' + monthName + '-' + year;
    };


    // Process the input commands and return the results
    var results = '';
    trainingcenter.engine.TrainingCenterEngine.initialize();
    commands.forEach(function(cmd) {
        if (cmd != '') {
            try {
                var cmdResult = trainingcenter.engine.TrainingCenterEngine.executeCommand(cmd);
                results += cmdResult + '\n';
            } catch (err) {
                console.log(err.stack);
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