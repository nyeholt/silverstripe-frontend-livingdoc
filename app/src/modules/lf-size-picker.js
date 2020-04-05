import * as $ from 'jquery';
import { Constants } from '../constants';

$(document).on('livingfrontend.updateLivingDoc', function (e, livingdoc) {
    var $pageOptions = $(Constants.SIZE_CONTROLS);

    let select = $('<select></select>');

    for (var name in Options) {
        let opt = $('<option>').val(name).text(name);
        select.append(opt);
    }

    select.change(function (e) {
        let device = $(this).val();

        const sizing = Options[device];
        if (sizing.x) {
            $(Constants.EDITOR_FRAME).css({
                width: sizing.x
            });
        } else {
            $(Constants.EDITOR_FRAME).css({
                width: '100%'
            });
        }
    })

    $pageOptions.append(select);
});


const Options = {
    'Responsive': {
        x: '',
        y: '',
    },
    'Galaxy S9': {
        'x': 360,
        'y': 740
    },
    'iPad': {
        x: '768',
        y: '1024',
    },
    'iPhone 6/7/8': {
        x: '375',
        y: '667',
    },
    'iPhone X': {
        x: '375',
        y: '812',
    },
    'iPhone 6/7/8 Plus': {
        x: '414',
        y: '736'
    },
    'Pixel': {
        x: '412',
        y: '732',
    },
    'Galaxy Note 5': {
        x: 480,
        y: 853
    },
    'Galaxy Note 9': {
        x: 360,
        y: 740
    }
};