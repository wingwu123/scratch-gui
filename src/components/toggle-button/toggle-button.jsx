import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';

import styles from './toggle-button.css';

/*
class ToggleButton extends React.Component {
    constructor(props) {
        super(props);

        bindAll(this, [
            'handleClick',
            'handleChange'
        ]);

        
        this.state = {
            checked: props.checked
        };
    }

    componentDidMount() {

    }

    render() {

        const { 
            checked,
            checkedLabel,
            uncheckedLabel,
         } = this.props;


        //
        return (

            <div className="switch-cont" onClick={this.handleClick}>
                <label className={styles.toggleButton}> 

                <input type="checkbox" onChange={this.handleChange} className={styles.switch} defaultValue={this.state.checked}/>

                </label>
            </div>
        );
    }

    handleClick() {

        console.trace("ToggleButton onClick");

        this.setState({
            checked: !this.state.checked
        });

        console.info("ToggleButton onClick", this.state.checked);

        this.props.onClick(this.state.checked);
    }

    handleChange(checked) {

    }
}

ToggleButton.propTypes = {
    checked: PropTypes.bool,
    checkedLabel: PropTypes.string,
    uncheckedLabel: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

ToggleButton.defaultProps = {
    //checked: false,
    checkedLabel: 'open',
    uncheckedLabel: 'close',
};
*/


 
const css_div_parent = {
    display: 'inline-block',
    position: 'relative',
    width: '4rem',
    height: '2rem',
    top: '.24rem',
    left: '.5rem',
    backgroundColor: 'rgb(158,227,251)',
    border: '1px solid rgb(158,227,251)',
    borderRadius: '1rem',
    transition: 'background-color .2s linear,border-color .2s linear'
};
 
const css_div_child = {
    position: 'absolute',
    width: '2rem',
    height: '2rem',
    backgroundColor: 'rgb(255,223,109)',
    borderRadius: '50%',
    boxShadow: '1px 1px 8px #888',
    transition: 'transform .2s linear'
};
 
//开关按钮组件
class ToggleButton extends React.Component {
    constructor(props) {
        super(props);
 
        let value = this.props.value;
 
        this.div_parent = null;
        this.div_child = null;
 
        this.state = {
            value: value
        };
 
        this.handleClick = this.handleClick.bind(this);
    }
 
    componentDidMount() {
        this.setStyle(this.state.value);
    }
 
    setStyle(v){
        if(!this.div_child || !this.div_parent)
        {
            return;
        }

        if(v){
            this.div_parent.style.backgroundColor = 'rgb(158,227,251)';
            this.div_parent.style.borderColor = 'rgb(158,227,251)';
            this.div_child.style.transform = 'translateX(2rem)';
        }
        else{
            this.div_parent.style.backgroundColor = 'white';
            this.div_parent.style.borderColor = '#ddd';
            this.div_child.style.transform = 'translateX(0rem)';
        }
    }
 
    handleClick(){
        this.setState(state => ({
            value: !state.value
        }),()=>{
            this.setStyle(this.state.value);
            this.props.onClick(this.state.value);
        });
    }
 
    render() {
        return (
            <div onClick={this.handleClick} style={css_div_parent} ref={(ref) => { this.div_parent = ref; }}>
                <div style={css_div_child} ref={(ref) => { this.div_child = ref; }}></div>
            </div>
        );
    }
}
 
export default ToggleButton;
