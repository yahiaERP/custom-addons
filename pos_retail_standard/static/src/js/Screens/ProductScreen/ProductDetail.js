odoo.define('pos_retail_standard.ProductDetail', function (require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const Registries = require('point_of_sale.Registries');

    class ProductDetail extends PosComponent {
        constructor() {
            super(...arguments);
        }

    }

    ProductDetail.template = 'ProductDetail';

    Registries.Component.add(ProductDetail);

    return ProductDetail;
});
