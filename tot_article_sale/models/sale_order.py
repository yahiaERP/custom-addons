from datetime import datetime
import string
from odoo import api,fields,models 

class Saleorder(models.Model):
    _inherit='sale.order'

    tot_products=fields.Integer(string="total produits",compute="compute_total_products")
    tot_qty=fields.Float(string="total quantité", compute="compute_sum_quantity")

    @api.depends("order_line.product_id")
    def compute_total_products(self):
        for order in self :
            list_of_product=[]
            for line in order.order_line:
                list_of_product.append(line.product_id)
            order.tot_products=len(set(list_of_product))

    @api.depends("order_line.product_uom_qty")
    def compute_sum_quantity(self):
        for order in self :
            tot_qty=0
            for line in order.order_line:
                tot_qty+=line.product_uom_qty
            order.tot_qty=tot_qty
