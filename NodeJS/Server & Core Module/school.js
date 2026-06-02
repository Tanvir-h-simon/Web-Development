const EventEmitter = require('events');
// const emitter = new EventEmitter();

class School extends EventEmitter {
    constructor(name) {
        super();
        this.name = name;
    }

    startClass() {
        console.log(`Class has started at ${this.name} school.`);
        this.emit('classStarted', this.name); // emitter.emit('classStarted', this.name)
    }
}

module.exports = School;