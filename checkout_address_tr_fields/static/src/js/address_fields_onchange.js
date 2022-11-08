odoo.define('checkout_address_tr_fields.address_fields', function (require) {
    "use strict";
var core = require('web.core');
var config = require('web.config');
var publicWidget = require('web.public.widget');
var VariantMixin = require('website_sale.VariantMixin');
var wSaleUtils = require('website_sale.utils');
const cartHandlerMixin = wSaleUtils.cartHandlerMixin;
require("web.zoomodoo");
const {extraMenuUpdateCallbacks} = require('website.content.menu');
const dom = require('web.dom');
const { cartesian } = require('@web/core/utils/arrays');
const { ComponentWrapper } = require('web.OwlCompatibility');
const { ProductImageViewerWrapper } = require("@website_sale/js/components/website_sale_image_viewer");

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
            init: function () {
                this._super.apply(this, arguments);
                //
                // this._changeCartQuantity = _.debounce(this._changeCartQuantity.bind(this), 500);
                // this._changeCountryState = _.debounce(this._changeCountryState.bind(this), 500);
                //
                this.isWebsite = true;
                //
                // delete this.events['change .main_product:not(.in_cart) input.js_quantity'];
                // delete this.events['change [data-attribute_exclusions]'];
            },
            /**
             * @private
             */
            _changeAddressFields: function (res_model, current_el, next_el) {
                // if (!$("#district_id").val()) {
                //     return;
                // } # TODO: check if district is selected
                this._rpc({
                    route: "/shop/address_infos/" + res_model + "/" + current_el.val(),
                }).then(function (data) {
                    // dont reload state at first loading (done in qweb)
                    if (next_el.data('init') === 0 || next_el.find('option').length === 1) {
                        if (data.values.length) {
                            next_el.html('');
                            _.each(data.values, function (x) {
                                var opt = $('<option>').text(x[1])
                                    .attr('value', x[0]);
                                next_el.append(opt);
                            });
                            next_el.parent('div').show();
                        } else {
                            next_el.val('').parent('div').hide();
                        }
                        next_el.data('init', 0);
                    } else {
                        next_el.data('init', 0);
                    }
                    //
                    // // manage fields order / visibility
                    // if (data.districts) {
                    //     var all_fields = ["street", "zip", "city", "country_name"]; // "state_code"];
                    //     _.each(all_fields, function (field) {
                    //         $(".checkout_autoformat .div_" + field.split('_')[0]).toggle($.inArray(field, data.fields) >= 0);
                    //     });
                    // }
                    //
                    // if ($("label[for='zip']").length) {
                    //     $("label[for='zip']").toggleClass('label-optional', !data.zip_required);
                    //     $("label[for='zip']").get(0).toggleAttribute('required', !!data.zip_required);
                    // }
                    // if ($("label[for='zip']").length) {
                    //     $("label[for='state_id']").toggleClass('label-optional', !data.state_required);
                    //     $("label[for='state_id']").get(0).toggleAttribute('required', !!data.state_required);
                    // }
                });
            },
            /**
             * @private
             * @param {Event} ev
             */
            _onChangeCountryState: function (ev) {
                if (!this.$('.checkout_autoformat').length) {
                    return;
                }
                var current_el = $("select[name='state_id']");
                var next_el = $("select[name='district_id']");
                var res_model = next_el.attr('model')   ;
                this._changeAddressFields(res_model, current_el, next_el);
            },

            /**
             * @private
             * @param {Event} ev
             */
            _onChangeDistrict: function (ev) {
                if (!this.$('.checkout_autoformat').length) {
                    return;
                }
                var current_el = $("select[name='district_id']");
                var next_el = $("select[name='region_id']");
                var res_model = next_el.attr('model')   ;
                this._changeAddressFields(res_model, current_el, next_el);
            },

            /**
             * @private
             * @param {Event} ev
             */
            _onChangeRegion: function (ev) {
                if (!this.$('.checkout_autoformat').length) {
                    return;
                }
                var current_el = $("select[name='region_id']");
                var next_el = $("select[name='neighbour_id']");
                var res_model = next_el.attr('model')   ;
                this._changeAddressFields(res_model, current_el, next_el);
            },
        });

    return {
        WebsiteSaleTurkeyFields: publicWidget.registry.WebsiteSaleTurkeyFields,
    };
});