odoo.define('checkout_address_tr_fields.address_fields', function(require) {
    "use strict";
    var core = require('web.core');
    var _t = core._t;
    var publicWidget = require('web.public.widget');
    var VariantMixin = require('website_sale.VariantMixin');
    var wSaleUtils = require('website_sale.utils');
    const cartHandlerMixin = wSaleUtils.cartHandlerMixin;
    publicWidget.registry.WebsiteSaleTurkeyFields = publicWidget.Widget.extend(VariantMixin,
        cartHandlerMixin, {
            selector: '.oe_website_sale',
            events: _.extend({}, VariantMixin.events || {}, {
                'change select[name="state_id"]': '_onChangeCountryState',
                'change select[name="district_id"]': '_onChangeDistrict',
                'change select[name="region_id"]': '_onChangeRegion',
            }),

            /**
             * @constructor
             */
            init: function() {
                this._super.apply(this, arguments);
                this.isWebsite = true;

            },
            /**
             * @private
             */
            _changeAddressFields: function($current_el) {
                var resModel = $current_el.data('res-model');
                var $nextEl = false;
                _.each($current_el.closest("div").nextAll('div').not('.w-100'), function(el, idx) {
                    let $select = $(el).find('select');
                    if (idx === 0) {
                        resModel = $select.attr('model');
                        $nextEl = $select;
                    }
                    $select.empty().append('<option value="" disabled selected>' + _t('Select...') + '</option>');
                });

                this._rpc({
                    route: "/shop/address_infos/" + resModel + "/" + $current_el.val(),
                }).then(function(data) {
                    if (data.values.length) {
                        _.each(data.values, function(x) {
                            var $option = $('<option>').text(x[1])
                                .attr('value', x[0]);
                            $nextEl.append($option);
                            if (resModel === 'address.region') {
                                $current_el.closest(".row").find(".div_city").find('input').val($current_el.find(
                                    "option:selected").text());

                            }
                        });
                    }
                });
            },
            /**
             * @private
             * @param {Event} ev
             */
            _onChangeCountryState: function(ev) {
                if (!this.$('.checkout_autoformat').length) {
                    return;
                }
                var $current_el = $(ev.currentTarget);
                this._changeAddressFields($current_el);
            },

            /**
             * @private
             * @param {Event} ev
             */
            _onChangeDistrict: function(ev) {
                if (!this.$('.checkout_autoformat').length) {
                    return;
                }
                var $current_el = $(ev.currentTarget);
                this._changeAddressFields($current_el);
            },

            /**
             * @private
             * @param {Event} ev
             */
            _onChangeRegion: function(ev) {
                if (!this.$('.checkout_autoformat').length) {
                    return;
                }
                var $current_el = $(ev.currentTarget);
                this._changeAddressFields($current_el);
            },
        });

    return {
        WebsiteSaleTurkeyFields: publicWidget.registry.WebsiteSaleTurkeyFields,
    };
});