const EDITOR_TYPE = 'scratch-gui/navigation/EDITOR_TYPE';
const CODE_CHANGDE = 'scratch-gui/navigation/CODE_CHANGDE';

// Constants use numbers to make it easier to work with react-tabs
const BLOCK_EDITOR = 'block';
const CODE_EDITOR = 'code';

const initialState = {
    editor: BLOCK_EDITOR,
    code:''
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case EDITOR_TYPE:
        return Object.assign({}, state, {
            editor: action.editor
        });
    case CODE_CHANGDE:
        return Object.assign({}, state, {
            code: action.code
        });
    default:
        return state;
    }
};

const editorTypeSelect = function (p_editor) {
    return {
        type: EDITOR_TYPE,
        editor: p_editor
    };
};

const codeChanged = function (code) {
    return {
        type: CODE_CHANGDE,
        code: code
    };
};

export {
    reducer as default,
    initialState as editorTypeInitialState,
    editorTypeSelect,
    codeChanged,
    BLOCK_EDITOR,
    CODE_EDITOR
};
