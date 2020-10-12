const EventEmitter = require('events');

class ServiceInstance extends EventEmitter {
    constructor() {
        super();
    }

    static get INITIALIZE_EVENT () {
        return 'INITIALIZE_EVENT';
    }

    set(name, service) {
        this[name] = service;
    }
    get(name) {
        return this[name];
    }
}

const serviceInstance = new ServiceInstance();

export default serviceInstance;