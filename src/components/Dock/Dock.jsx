import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';

import autoprefix from './autoprefix';

import icon_code from './icon-code.svg';
import icon_close from './icon-close.svg';

const styles = {

    dock_wrapper: {
        position: 'relative',
        width: '0',
        height: '0',
        display: 'inline-block'
    },

    dock: {
        position: 'absolute',
        zIndex: 200,        
        background: 'rgba(255, 255, 255, 1.0)',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        display: 'inline-block',
        borderTopRightRadius: '0.5rem',
        borderBottomRightRadius: '0.5rem',
    },

    dockBorder: {
        border: 'solid 1px rgba(200, 200, 200, 1.0)',
    },

    dockHidden: {
        opacity: 0
    },

    dockResizing: {
        transition: 'none'
    },

    dockContentWarpper: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        display: 'flex',
    },

    dockContent: {
        display: 'inline-block',
        width: '100',
        height: '100%',
        overflow: 'hidden'
    },

    resizer: {
        display: 'inline-block',
        border: 'none',
        zIndex: 2,
        opacity: 0
    },

    closeButton: {
        position: 'absolute',
        //display: '-webkit-box',
        //display: -webkit - flex,
        //display: -ms - flexbox,
        display: 'flex',
        //-webkit-box-align: center,
        //-webkit-align-items: center,
        //-ms-flex-align: center,
        alignItems: 'center',
        //-webkit-box-pack: center,
        //-webkit-justify-content: center,
        //-ms-flex-pack: center,
        justifyContent: 'center',
        userSelect: 'none',
        paddingLeft: '0.2rem',
        zIndex: '99',
        top: '94px',
        left: '-30px',
        cursor: 'pointer',
        width: '30px',
        height: '24px',
        background: 'rgba(0,185,255, 0.9)',
        borderRadius: '80px 0px 0px 80px'
    },

    langHead: {
        userSelect: 'none',
        paddingLeft:'10px',
        height: '30px',
        lineHeight:'30px',
        borderBottom: 'solid 1px rgba(200, 200, 200, 1.0)',
        color:'rgba(65, 105, 255, 1)'
    }
};


function getDockStyles(
    { dockStyle, duration, isVisible, parentWidth, parentHeight, isResizing, size }
) {
    let posStyle;

    posStyle = {
        left: (parentWidth - size) + "px",
        width: size + "px",
        height : "100%"
    };

    const dock_style = [
        styles.dock,
        dockStyle,
        posStyle,
        isVisible && styles.dockBorder,
        isResizing && styles.dockResizing
    ];

    //console.log("dock_style " + parentWidth + " " + size);

    return dock_style;
}

const resizer_width = 2;

function getResizerStyles() {
    let resizerStyle;
    const size = resizer_width;

    resizerStyle = {
        left: -size / 2,
        width: size,
        top: 0,
        height: '100%',
        cursor: 'col-resize'
    };

    //console.log("styles.resizer  " + JSON.stringify(styles.resizer))

    return [
        styles.resizer,
        autoprefix(resizerStyle)
    ];
}

function getDockContentStyles(
    {size, isVisible}
    ){
    let contentStyles = {
        width: (size - resizer_width ) + "px"
    }

    return [
        styles.dockContent,
        contentStyles,
        !isVisible && styles.dockHidden
    ];
}

class Dock extends React.Component {
    constructor(props) {
        super(props);

        bindAll(this, [
            'handleResize',
            'handleWrapperLeave',
            'handleMouseDown',
            'handleMouseUp',
        ]);

        /*
        this.state = {
            size: props.size || props.defaultSize
        };
        */
    }

    componentDidMount() {
        window.addEventListener('mouseup', this.handleMouseUp);
    }

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.handleMouseUp);
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate(prevProps) {

    }

    render() {

        const { 
            children, 
            isVisible,
            handleDockClose
         } = this.props;

        const dockStyles = Object.assign({}, ...getDockStyles(this.props));
        const resizerStyles = Object.assign({}, ...getResizerStyles());

        const dockContent = Object.assign({}, ...getDockContentStyles(this.props));

        //
        return (

            <div style={dockStyles}>
                <div style={styles.closeButton} onClick={handleDockClose}>
                    <img draggable={false} src={ isVisible ? icon_close : icon_code} />
                </div>
                <div style={styles.dockContentWarpper}>
                    <div style={resizerStyles}
                        onMouseDown={this.handleMouseDown} />
                    <div style={dockContent}>
                        <div style = {styles.langHead}>C 代码</div>
                        { children }
                    </div>
                </div>

            </div>
        );
    }

    handleResize() {
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(this.updateWindowSize.bind(this, true));
        } else {
            this.updateWindowSize(true);
        }
    }

    handleWrapperLeave() {
        if(this.props.resizingCallback)
        {
            this.props.resizingCallback(false);
        }
    }

    handleMouseDown(){

        if(this.props.resizingCallback)
        {
            this.props.resizingCallback(true);
        }
    }

    handleMouseUp(){

        if(this.props.resizingCallback)
        {
            this.props.resizingCallback(false);
        }
    }

    /*

    handleMouseMove(e) {
        if (!this.state.isResizing)
            return;
        e.preventDefault();
        //console.log(" dock mouse move" + e.clientX + " " + e.clientY );

        const { clientX: x, clientY: y } = e;

        this.setState({ size: this.props.parentWidth - x });
    }
    */
}

Dock.propTypes = {
    zIndex: PropTypes.number,
    size: PropTypes.number,
    defaultSize: PropTypes.number,
    isVisible: PropTypes.bool,
    parentHeight:PropTypes.number,
    parentWidth:PropTypes.number,
    resizingCallback:PropTypes.func,
    duration: PropTypes.number
};

Dock.defaultProps = {
    zIndex: 99999999,
    size:400,
    defaultSize: 400,
    isVisible: true,
    parentHeight:100,
    parentWidth:100,
    duration: 200
};

export default Dock;
