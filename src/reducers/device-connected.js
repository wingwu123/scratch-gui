const DEVICE_CONNECTED = 'scratch-gui/device/DEVICE_CONNECTED';
const DEVICE_CONNECTED_MODE = 'scratch-gui/device/DEVICE_CONNECTED_MODE';

const CONNECT_MODE_DEWNLOAD = 1;
const CONNECT_MODE_ONLINE = 2;

// Constants use numbers to make it easier to work with react-tabs

const initialState = {
    connected: false,
    mode: CONNECT_MODE_DEWNLOAD
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case DEVICE_CONNECTED:
            return Object.assign({}, state, {
                connected: action.connected
            });
        case DEVICE_CONNECTED_MODE:
            return Object.assign({}, state, {
                mode: action.mode
            });
        default:
            return state;
    }
};

const connected = function () {
    return {
        type: DEVICE_CONNECTED,
        connected: true
    };
};

const disconnected = function () {
    return {
        type: DEVICE_CONNECTED,
        connected: false
    };
};

const setConnectMode = function (mode) {
    return {
        type: DEVICE_CONNECTED_MODE,
        mode: mode
    };
};



export {
    reducer as default,
    initialState as connectedInitialState,
    connected,
    disconnected,
    CONNECT_MODE_DEWNLOAD,
    CONNECT_MODE_ONLINE,
    setConnectMode
};
