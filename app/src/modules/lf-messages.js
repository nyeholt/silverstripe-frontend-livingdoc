
const messages = [];

const MESSAGE_DIV = '.livingdocs-toolbar-messages';

export function initialise_messages() {
}

export function showMessage(text) {
    messages.unshift({
        time: (new Date()).getTime(),
        message: text
    });

    updateMessageDisplay();
}

function updateMessageDisplay() {
    while(messages.length > 10) {
        messages.pop();
    }

    $(MESSAGE_DIV).empty();

    for (let i = 0; i < messages.length; i++) {
        $(MESSAGE_DIV).append('<div>' + messages[i].message + '</div>');
    }
}
