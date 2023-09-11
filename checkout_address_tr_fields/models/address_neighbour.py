# Copyright 2023 Yiğit Budak (https://github.com/yibudak)
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl)
from odoo import models, api


class AddressNeighbour(models.Model):
    _inherit = "address.neighbour"

    @api.model
    def get_neighbour_info_website(self, neighbour_id):
        """
        Get Postal Code and Name of the Neighbour to autocomplete the form
        """
        vals = {}
        if neighbour_id != 0:
            neighbour = self.browse(int(neighbour_id))
            vals["id"] = neighbour.id
            vals["name"] = neighbour.name
            vals["postcode"] = neighbour.code
        return vals
