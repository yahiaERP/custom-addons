odoo.define('point_of_sale.CustomerFacingScreenWiget', function (require) {
    'use strict';

    const {useState} = owl;
    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');

    class CustomerFacingScreenWiget extends PosComponent {
        constructor() {
            super(...arguments);
            this.status = useState({
                turn_on: false,
            })
            if (this.env.pos.config.customer_facing_screen_auto) {
                this.onClick()
            }
        }



        get isHidden() {
            if (this.env.pos.config.sync_multi_session && this.env.pos.config.screen_type == 'kitchen') {
                return true
            } else {
                return false
            }
        }
    }

   // CustomerFacingScreenWiget.template = 'CustomerFacingScreenWiget';

    //Registries.Component.add(CustomerFacingScreenWiget);

    //return CustomerFacingScreenWiget;
});
