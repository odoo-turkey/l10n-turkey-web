# Copyright 2022 Yiğit Budak (https://github.com/yibudak)
# License AGPL-3.0 or later (https://www.gnu.org/licenses/agpl).
{
    "name": "Checkout Address Fields TR",
    "version": "16.0.1.0.0",
    "summary": "Address fields for Turkey",
    "description": """This Module is used to add custom fields to the checkout address form.""",
    "category": "Website/Website",
    "license": "LGPL-3",
    "website": "https://github.com/odoo-turkey",
    "author": "Yigit Budak",
    "depends": ["web", "l10n_tr_address"],
    "data": [
        "templates/checkout.xml",
        "data/data.xml",
    ],
    "assets": {
        "web.assets_frontend": [
            "checkout_address_tr_fields/static/src/js/address_fields_onchange.js",
        ],
    },
    "installable": True,
    "auto_install": False,
}
