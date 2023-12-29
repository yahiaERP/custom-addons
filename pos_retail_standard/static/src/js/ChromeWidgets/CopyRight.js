odoo.define('point_of_sale.CopyRight', function (require) {
    'use strict';

    const {useState} = owl;
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');

    class CopyRight extends PosComponent {
        constructor() {
            super(...arguments);
        }

        
    }

   // CopyRight.template = 'CopyRight';

    //Registries.Component.add(CopyRight);

    return CopyRight;
});
