import { defineMessages, FormattedMessage, injectIntl, intlShape } from 'react-intl';




const message_intl = defineMessages({
    QuitDialog_message: {
        id: 'gui.AppStateBroker.QuitDialog.message',
        description: '',
        defaultMessage: 'Leave Scratch?'
    },
    QuitDialog_detail: {
        id: 'gui.AppStateBroker.QuitDialog.detail',
        description: '',
        defaultMessage: 'Any unsaved changes will be lost.'
    },
    QuitDialog_buttons_Stay: {
        id: 'gui.AppStateBroker.QuitDialog.buttons.Stay',
        description: '',
        defaultMessage: 'Stay'
    },
    QuitDialog_buttons_Leave: {
        id: 'gui.AppStateBroker.QuitDialog.buttons.Leave',
        description: '',
        defaultMessage: 'Leave'
    }
});

class AppStateBroker {
    constructor(intl, locale) {
        this.service = null;
        this.intl = intl;
        this.locale = null;

        this.updateMessages(intl, locale);
    }

    setService(service) {
        this.service = service;
        this.setMessages()
    }

    quit() {
        this.service.quit()
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
            messages.QuitDialog = 
            {
                message: intl.formatMessage(message_intl.QuitDialog_message),
                detail: intl.formatMessage(message_intl.QuitDialog_detail),
                buttons: [intl.formatMessage(message_intl.QuitDialog_buttons_Stay)
                    , intl.formatMessage(message_intl.QuitDialog_buttons_Leave)]
            };
    
            this.setMessages();
        }
    }
}

//const WrappedBroker = injectIntl(UpdaterBroker);

export default AppStateBroker;