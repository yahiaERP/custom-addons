from odoo import models, fields


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    reference_fournisseur = fields.Char(string="Référence fournisseur")