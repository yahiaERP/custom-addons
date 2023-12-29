odoo.define('point_of_sale.LanguageSelection', function (require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');

    class LanguageSelection extends PosComponent {
        constructor() {
            super(...arguments);
        }

      
    }

    LanguageSelection.template = 'LanguageSelection';

    Registries.Component.add(LanguageSelection);

    return LanguageSelection;
});
