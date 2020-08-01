import { Constants } from "../constants";

const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length)
// source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js

export function trigger_on_click_outside(element, callback) {
    const outsideClickListener = event => {
        if (!element.contains(event.target) && isVisible(element)) { // or use: event.target.closest(selector) === null
            const removeListener = callback(element, event.target);
            if (removeListener !== false) {
                removeClickListener();
            }
        }
    }

    const removeClickListener = () => {
        $(Constants.EDITOR_FRAME).contents()[0].removeEventListener('click', outsideClickListener);
    }
    $(Constants.EDITOR_FRAME).contents()[0].addEventListener('click', outsideClickListener);

}
