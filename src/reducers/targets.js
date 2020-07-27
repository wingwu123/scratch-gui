const UPDATE_TARGET_LIST = 'scratch-gui/targets/UPDATE_TARGET_LIST';
const HIGHLIGHT_TARGET = 'scratch-gui/targets/HIGHLIGHT_TARGET';

const initialState = {
    devices: {},
    sprites: {},
    stage: {},
    highlightedTargetId: null,
    highlightedTargetTime: null
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case UPDATE_TARGET_LIST:{

        let devices = action.targets
        .filter(target => {

            return !target.isStage && target.deviceType != "";
        } )
        .reduce(
            (targets, target, listId) => Object.assign(
                targets,
                {[target.id]: {order: listId, ...target}}
            ),
            {}
        );

        return Object.assign({}, state, {
            devices: devices,
            sprites: action.targets
                .filter(target => {
                    return !target.isStage && target.deviceType == "";
                } )
                .reduce(
                    (targets, target, listId) => Object.assign(
                        targets,
                        {[target.id]: {order: listId, ...target}}
                    ),
                    {}
                ),
            stage: action.targets
                .filter(target => target.isStage)[0] || {},
            editingTarget: action.editingTarget
        });
    }
        
    case HIGHLIGHT_TARGET:
        return Object.assign({}, state, {
            highlightedTargetId: action.targetId,
            highlightedTargetTime: action.updateTime
        });
    default:
        return state;
    }
};
const updateTargets = function (targetList, editingTarget) {

    /*
    console.trace("--tragets updateTargets--");

    for (const key in targetList[0]) {
        console.log("editingTarget deviceType: ", key );
    }
    */

    return {
        type: UPDATE_TARGET_LIST,
        targets: targetList,
        editingTarget: editingTarget
    };
};
const highlightTarget = function (targetId) {
    return {
        type: HIGHLIGHT_TARGET,
        targetId: targetId,
        updateTime: Date.now()
    };
};
export {
    reducer as default,
    initialState as targetsInitialState,
    updateTargets,
    highlightTarget
};
