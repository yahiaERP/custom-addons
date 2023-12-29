odoo.define('pos_retail_standard.OrderReceipt', function (require) {
    'use strict';

    const Registries = require('point_of_sale.Registries');
    const OrderReceipt = require('point_of_sale.OrderReceipt');
    const {useState} = owl.hooks;

    const RetailOrderReceipt = (OrderReceipt) =>
        class extends OrderReceipt {
            constructor() {
                super(...arguments);
                this.state = useState({
                    orderRequest: this.props.orderRequest,
                
                
                });
                this._currentOrder = this.env.pos.get_order();
                if (this._currentOrder) {
                    this._currentOrder.orderlines.on('change', this._updateSummary, this);
                    this._currentOrder.orderlines.on('remove', this._updateSummary, this);
                    this._currentOrder.paymentlines.on('change', this._updateSummary, this);
                    this._currentOrder.paymentlines.on('remove', this._updateSummary, this);
                    this.env.pos.on('change:selectedOrder', this._updateCurrentOrder, this);
                    this._updateSummary()
                }
                this._receiptEnv = this.env.pos.getReceiptEnv();
                if (this._receiptEnv && this._receiptEnv.order_fields_extend) {
                    this.order_fields_extend = this._receiptEnv.order_fields_extend
                } else {
                    this.order_fields_extend = null
                }
                if (this._receiptEnv && this._receiptEnv.delivery_fields_extend) {
                    this.delivery_fields_extend = this._receiptEnv.delivery_fields_extend
                } else {
                    this.delivery_fields_extend = null
                }
                if (this._receiptEnv && this._receiptEnv.invoice_fields_extend) {
                    this.invoice_fields_extend = this._receiptEnv.invoice_fields_extend
                } else {
                    this.invoice_fields_extend = null
                }
            }
 
            willUpdateProps(nextProps) {
                this._receiptEnv = this.env.pos.getReceiptEnv();
            }

            mounted() {
                if (!this.props.orderRequest && this.env.pos.printers && this.env.pos.printers.length != 0 && this.props.order) {
                    const printers = this.env.pos.printers;
                    const currentOrder = this.props.order
                    currentOrder.orderlines.models.forEach(l => {
                        if (l.mp_dbclk_time != 0 && l.mp_skip) {
                            this.mp_dbclk_time = 0
                            l.set_skip(false) 
                            
                        }
                    })
                    let orderRequest = null
                    for (let i = 0; i < printers.length; i++) {
                        let printer = printers[i];
                        let changes = currentOrder.computeChanges(printer.config.product_categories_ids);
                        if (changes['new'].length > 0 || changes['cancelled'].length > 0) {
                            let orderReceipt = currentOrder.buildReceiptKitchen(changes);
                            orderRequest = orderReceipt
                            if ((currentOrder.syncing == false || !currentOrder.syncing) && this.env.pos.pos_bus && !this.env.pos.splitbill && this._updateSummary) {
                                this.env.pos.pos_bus.requests_printers.push({
                                    action: 'request_printer',
                                    data: {
                                        uid: currentOrder.uid,
                                        computeChanges: orderReceipt,
                                    },
                                    order_uid: currentOrder.uid,
                                })
                            }
                            this.state.orderRequest = orderRequest
                        }
                    }
                }
                super.mounted();
            }

            _updateSummary() {
                const total = this._currentOrder ? this._currentOrder.get_total_with_tax() : 0;
                const tax = this._currentOrder ? total - this._currentOrder.get_total_without_tax() : 0;
                this.state.total = this.env.pos.format_currency(total);
                this.state.tax = this.env.pos.format_currency(tax);
                let productsSummary = {}
                let totalItems = 0
                let totalQuantities = 0
                let totalCost = 0
                if (this._currentOrder) {
                    for (let i = 0; i < this._currentOrder.orderlines.models.length; i++) {
                        let line = this._currentOrder.orderlines.models[i]
                        totalCost += line.product.standard_price * line.quantity
                        if (!productsSummary[line.product.id]) {
                            productsSummary[line.product.id] = line.quantity
                            totalItems += 1
                        } else {
                            productsSummary[line.product.id] += line.quantity
                        }
                        totalQuantities += line.quantity
                    }
                }
                const discount = this._currentOrder ? this._currentOrder.get_total_discounts() : 0;
                this.state.discount = (discount);
                const totalWithOutTaxes = this._currentOrder ? this._currentOrder.get_total_without_tax() : 0;
                this.state.totalWithOutTaxes = (totalWithOutTaxes);
                this.state.margin = (totalWithOutTaxes - totalCost)
                this.state.totalItems = (totalItems)
                this.state.totalQuantities = (totalQuantities)
            }
    
            get orderFieldsExtend() {
                return this.order_fields_extend
            }

            get orderRequest() {
                return this.state.orderRequest
            }

            get deliveryFieldsExtend() {
                return this.delivery_fields_extend
            }

            get invoiceFieldsExtend() {
                return this.invoice_fields_extend
            }
        }

    Registries.Component.extend(OrderReceipt, RetailOrderReceipt);
    setTimeout(() => {
        if (self.odoo.session_info && self.odoo.session_info['config']['receipt_template'] == 'retail') {
            OrderReceipt.template = 'RetailOrderReceipt';
        }
        if (self.odoo.session_info && self.odoo.session_info['config']['receipt_template'] == 'arabic') {
            OrderReceipt.template = 'ArabicReceipt';
        }
        if (self.odoo.session_info && self.odoo.session_info['config']['receipt_template'] == 'a4') {
            OrderReceipt.template = 'A4Receipt';}}, 2000)

    Registries.Component.add(RetailOrderReceipt);
    return OrderReceipt;
});

