import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import UpdaterBroker from '../broker/UpdaterBroker.js';
import ServiceInstance from '../broker/ServiceInstance.js';
import AppStateBroker from '../broker/AppStateBroker.js';

const ServiceHOC = function (WrappedComponent) {
    class ServiceComponent extends React.Component {
        componentDidMount() {


            let check = false;

            if (typeof (ServiceInstance.updaterBroker) == "undefined") {

                check = true;
                ServiceInstance.updaterBroker = new UpdaterBroker(this.props.intl);
            }

            if (ServiceInstance.updater) {

                ServiceInstance.updaterBroker.setService(ServiceInstance.updater);
            }

            

            if (typeof (ServiceInstance.appStateBroker) == "undefined") {
                ServiceInstance.appStateBroker = new AppStateBroker(this.props.intl);
                if (ServiceInstance.appState) {
                    ServiceInstance.appStateBroker.setService(ServiceInstance.appState);
                }
            }

            ServiceInstance.updaterBroker.updateMessages(this.props.intl, this.props.locale);
            ServiceInstance.appStateBroker.updateMessages(this.props.intl, this.props.locale);

            ServiceInstance.emit(ServiceInstance.INITIALIZE_EVENT);

            if (check) {
                ServiceInstance.updaterBroker.checkForUpdates();
            }

        }
        componentDidUpdate (prevProps) {

        }
        
        render () {
            const {
                intl,
                locale,
                ...componentProps
            } = this.props;
            return (
                <WrappedComponent
                    {...componentProps}
                />
            );
        }
    }

    ServiceComponent.propTypes = {
        intl: intlShape.isRequired,
        locale: PropTypes.string.isRequired,
    };

    ServiceComponent.defaultProps = {

    };

    const mapStateToProps = state => {

        return {
            locale: state.locales.locale
        };
    };

    const mapDispatchToProps = dispatch => ({

    });

    return injectIntl(connect(
        mapStateToProps,
        mapDispatchToProps,
    )(ServiceComponent));
};

export {
    ServiceHOC as default
};
