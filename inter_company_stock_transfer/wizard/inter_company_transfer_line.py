# -*- coding: utf-8 -*-

from odoo import models, fields, api


class InterCompanyTransferLine(models.TransientModel):

    _name = 'inter.company.transfer.line'

    name = fields.Char('Description', index=True)
    stock_transfer_id = fields.Many2one('inter.company.transfer')
    barcode = fields.Char(string='Barcode')
    product_id = fields.Many2one('product.product')
    product_uom = fields.Many2one('uom.uom')
    product_uom_qty = fields.Float('Initial Demand')

    @api.onchange('product_id')
    def onchange_product_id(self):
        product = self.product_id.with_context(lang=self.env.user.lang)
        self.product_uom = product.uom_id.id
        self.name = product.partner_ref or ''
        return {
            'domain': {
                'product_uom': [
                    ('category_id', '=', product.uom_id.category_id.id)
                ]
            }
        }
    @api.onchange('barcode')
    def _onchange_barcode_scan(self):
        product_rec = self.env['product.product']
        if self.barcode:
            product = product_rec.search([('barcode', '=', self.barcode)])
            self.product_id = product.id
