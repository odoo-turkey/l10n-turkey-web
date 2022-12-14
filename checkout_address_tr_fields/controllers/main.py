# Copyright 2022 Yiğit Budak (https://github.com/yibudak)
# License AGPL-3.0 or later (http://www.gnu.org/licenses/agpl)
from odoo import http, _
from odoo.addons.website_sale.controllers.main import WebsiteSale


class WebsiteSaleInherit(WebsiteSale):

    @http.route(['/shop/address_infos/<string:res_model>/<int:res_id>'],
                type='json', auth="public", methods=['POST'], website=True)
    def state_infos(self, res_model, res_id, **kw):
        '''
        adres bilgilerini alırken kullandığımız base controller
        '''
        address_models = ['address.district',
                          'address.region',
                          'address.neighbour']

        vals = {'values': [(0, _('Select...'))]}
        # domain = [('country_id', '=', 224)]  # Turkey

        if (res_model and res_model in address_models) and res_id:

            if res_model == 'address.district':
                domain = [('state_id', '=', res_id)]

            elif res_model == 'address.region':
                domain = [('district_id', '=', res_id)]

            elif res_model == 'address.neighbour':
                domain = [('region_id', '=', res_id)]

            res = http.request.env[res_model].search(domain)
            # sorted_dstr = sorted(districts, key=lambda x: x.name)
            # Todo: Türkçe karakterleri sort ederken sorun yaşıyoruz.
            vals['values'].extend([(r.id, r.name) for r in res])

        return vals

    def checkout_form_validate(self, mode, all_form_values, data):
        '''
        Form validation method
        '''
        error, error_msg = super(WebsiteSaleInherit,
                                 self).checkout_form_validate(
            mode, all_form_values, data)

        if not (all_form_values.get('state_id') and all_form_values.get(
                'state_id').isdigit()):
            error['state_id'] = 'error'
            error_msg.append(_('Please select a state.'))

        if not (all_form_values.get('district_id') and all_form_values.get(
                'district_id').isdigit()):
            error['district_id'] = 'error'
            error_msg.append(_('Please select a district.'))

        if not (all_form_values.get('region_id') and all_form_values.get(
                'region_id').isdigit()):
            error['region_id'] = 'error'
            error_msg.append(_('Please select a region.'))

        if not (all_form_values.get('neighbour_id') and all_form_values.get(
                'neighbour_id').isdigit()):
            error['neighbour_id'] = 'error'
            error_msg.append(_('Please select a neighbour.'))

        return error, error_msg

    def country_infos(self, country, mode, **kw):
        '''
        state seçiminin direkt olarak seçili gelmesini engeller. seçiniz diye boş option ekler
        '''
        res = super().country_infos(country, mode, **kw)
        states = res.get('states')
        if states and len(states) > 0:
            res['states'].insert(0, (0, _('Select...'), '0'))
        return res

    def _get_country_related_render_values(self, kw, render_values):
        '''
        adresleri düzenlerken eklerken yeni eklediğimiz fieldları da render etmesini sağlar.
        '''
        res = super()._get_country_related_render_values(kw, render_values)
        vals = render_values['checkout']

        if isinstance(vals, dict):
            state_id = int(vals['state_id']) if vals.get(
                'state_id') and vals.get('state_id').isdigit() else False
            district_id = int(vals['district_id']) if vals.get(
                'district_id') and vals.get('district_id').isdigit() else False
            region_id = int(vals['region_id']) if vals.get(
                'region_id') and vals.get('region_id').isdigit() else False

        else:
            state_id = vals.state_id.id
            district_id = vals.district_id.id
            region_id = vals.region_id.id

        if state_id:
            res.update({
                'districts': http.request.env['address.district'].search(
                    [('state_id', '=', state_id)])
            })

        if district_id:
            res.update({
                'regions': http.request.env['address.region'].search(
                    [('district_id', '=', district_id)])
            })

        if region_id:
            res.update({
                'neighbours': http.request.env['address.neighbour'].search(
                    [('region_id', '=', region_id)])
            })

        return res
