import React from 'react';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import classNames from 'classnames';
import styles from './editor-selector.css';

class EditorSelector extends React.Component {
    constructor(props) {
        super(props);

        bindAll(this, [
            //'handleResize',
        ]);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {

        const { 
            editor
         } = this.props;

        const self = this;

        return (

            <div className={styles.codeTypeSelectWrapper}>
                <div className={styles.codeTypeSelectInnerWrapper}>
                    <div className={classNames(styles.codeTypeSelectSelectItem, editor == 'block' ? styles.codeTypeSelectSelected : null)}
                        onClick={function(){
                            self.props.onSelected('block');}} >
                        <span className={styles.codeTypeSelectText}>积木</span>
                    </div>
                    <div className={classNames(styles.codeTypeSelectSelectItem, editor == 'code' ? styles.codeTypeSelectSelected : null)}
                        onClick={function(){
                            self.props.onSelected('code');}} >
                        <span className={styles.codeTypeSelectText}>C 代码</span>
                    </div>
                </div>
            </div>
        );
    }
}

EditorSelector.propTypes = {
    editor: PropTypes.string,
    onSelected: PropTypes.func,
};

EditorSelector.defaultProps = {
    editor: 'block',
};


export default EditorSelector;