# Copyright 2023 Yiğit Budak (https://github.com/yibudak)
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl)
from odoo import models


class IrHttp(models.AbstractModel):
    _inherit = "ir.http"

    @classmethod
    def _get_translation_frontend_modules_name(cls):
        """
        Add the module name to the list of modules to load translations for
        frontend translations. (javascript translations)
        """
        mods = super(IrHttp, cls)._get_translation_frontend_modules_name()
        return mods + ["checkout_address_tr_fields"]
