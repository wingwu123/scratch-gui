import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';


const message_intl = defineMessages({
    errorDialog_title: {
        id: 'gui.UpdaterBroker.errorDialog.title',
        description: '',
        defaultMessage: 'Error:'
    },
    availablerDialog_title: {
        id: 'gui.UpdaterBroker.availablerDialog.title',
        description: '',
        defaultMessage: 'Found Updates'
    },
    availablerDialog_message: {
        id: 'gui.UpdaterBroker.availablerDialog.message',
        description: '',
        defaultMessage: 'Found updates, do you want update now?'
    },
    availablerDialog_buttons_Sure: {
        id: 'gui.UpdaterBroker.availablerDialog.buttons.sure',
        description: '',
        defaultMessage: 'Sure'
    },
    availablerDialog_buttons_No: {
        id: 'gui.UpdaterBroker.availablerDialog.buttons.no',
        description: '',
        defaultMessage: 'No'
    },

    downloadedDialog_title: {
        id: 'gui.UpdaterBroker.downloadedDialog.title',
        description: '',
        defaultMessage: 'Install Updates'
    },
    downloadedDialog_message: {
        id: 'gui.UpdaterBroker.downloadedDialog.message',
        description: '',
        defaultMessage: 'Updates downloaded, application will be quit for update...'
    },
    downloadedDialog_buttons_Sure: {
        id: 'gui.UpdaterBroker.downloadedDialog.buttons.sure',
        description: '',
        defaultMessage: 'Sure'
    },
});


class UpdaterBroker {
    constructor(intl, locale) {
        this.service = null;
        this.intl = intl;
        this.locale = null;
        this.updateMessages(intl, locale);
    }
    setService(service) {
        this.service = service;
        this.setMessages();
    }
    checkForUpdates() {
        this.service.checkForUpdates();
    }

    downloadUpdate() {
        this.service.downloadUpdate();
    }

    appInfo() {
        return this.service.appInfo();
    }

    progress() {
        return this.service.progress();
    }

    hasUpdate() {
        return this.service.hasUpdate();
    }

    setMessages() {

        if(this.service != null)
        {
            this.service.setMessages(this.messages)
        } 
    }

    updateMessages(intl, locale) {

        if(this.locale != locale)
        {
            this.locale = locale;

            let messages = {}
            this.messages = messages;
            messages.errorDialog = {title: intl.formatMessage(message_intl.errorDialog_title)};
            messages.availablerDialog = 
            {
                title: intl.formatMessage(message_intl.availablerDialog_title),
                message: intl.formatMessage(message_intl.availablerDialog_message),
                buttons: [intl.formatMessage(message_intl.availablerDialog_buttons_Sure), intl.formatMessage(message_intl.availablerDialog_buttons_No)]
            };
            messages.downloadedDialog = 
            {
                title: intl.formatMessage(message_intl.downloadedDialog_title),
                message: intl.formatMessage(message_intl.downloadedDialog_message),
                buttons: [intl.formatMessage(message_intl.downloadedDialog_buttons_Sure)]
            };
    
            this.setMessages();
        }
    }
}

//const WrappedBroker = injectIntl(UpdaterBroker);

export default UpdaterBroker;