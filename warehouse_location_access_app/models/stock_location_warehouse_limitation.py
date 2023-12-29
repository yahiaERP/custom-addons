# -*- coding: utf-8 -*-

from odoo import models, fields, api,_


class ResUsers(models.Model):
	_inherit = 'res.users'

	available_location_ids = fields.Many2many('stock.location','res_user_location_default_rel','user_id','location_id', string='Allowed Locations')


	def write(self, vals):
		if 'available_location_ids' in vals:
			self.env['ir.model.access'].call_cache_clearing_methods()
			self.env['ir.rule'].clear_caches()
			
		return super(ResUsers, self).write(vals)	