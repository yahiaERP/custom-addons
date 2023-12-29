
from odoo import models, fields,api


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    marge = fields.Float(string="marge")


    @api.onchange('standard_price','marge')
    def on_change_price(self):
        if self.marge == 0:
            self.list_price = self.standard_price
        else:
            self.list_price=(self.standard_price*self.marge)+self.standard_price 
    
    
    


        


        