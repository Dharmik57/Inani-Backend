import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { Poppler } from 'node-poppler';
import sharp from 'sharp';
import CANADA_POST from '../config/delivery.config';
import { sendEmail } from '../utility/mailer';

class CanadaPostService {
    getDeliveryCharge = async (seller_code, customer_code, weight) => {
        try {
            var data =
                '<?xml version="1.0" encoding="UTF-8"?>\n<mailing-scenario xmlns="http://www.canadapost.ca/ws/ship/rate-v4">\n  <customer-number>' +
                CANADA_POST.CUSTOMER +
                '</customer-number>\n  <parcel-characteristics>\n    <weight>' +
                weight +
                '</weight>\n  </parcel-characteristics>\n  <origin-postal-code>' +
                seller_code +
                '</origin-postal-code>\n  <destination>\n    <domestic>\n      <postal-code>' +
                customer_code +
                '</postal-code>\n    </domestic>\n  </destination>\n</mailing-scenario>';

            var config = {
                method: 'POST',
                url: `${CANADA_POST.HOST}/rs/ship/price`,
                headers: {
                    Authorization: CANADA_POST.TOKEN,
                    'Accept-language': 'en-CA',
                    'Content-Type': 'application/vnd.cpc.ship.rate-v4+xml',
                    Accept: 'application/vnd.cpc.ship.rate-v4+xml',
                },
                data,
            };

            const result = await axios(config);
            return result.data;
        } catch (err) {
            return null;
        }
    };

    createShipment = async (sender_info, customer_info, weight) => {
        try {
            // seller address
            const seller_name = `${sender_info.first_name} ${sender_info.last_name}`;

            // customer address
            const customer_name = `${customer_info.first_name} ${customer_info.last_name}`;

            var data =
                '<?xml version="1.0" encoding="UTF-8"?>\r\n<non-contract-shipment xmlns="http://www.canadapost.ca/ws/ncshipment-v4">\r\n\t<requested-shipping-point>' +
                sender_info.postal_code +
                '</requested-shipping-point>\r\n\t<delivery-spec>\r\n\t\t<service-code>' +
                CANADA_POST.SERVICE_CODE +
                '</service-code>\r\n\t\t<sender>\r\n<name>' +
                seller_name +
                '</name>\r\n\t\t\t<company>' +
                seller_name +
                '</company>\r\n\t\t\t<contact-phone>' +
                sender_info.phone_number +
                '</contact-phone>\r\n\t\t\t<address-details>\r\n\t\t\t\t<address-line-1>' +
                sender_info.address +
                '</address-line-1>\r\n\t\t\t\t<city>' +
                sender_info.city +
                '</city>\r\n\t\t\t\t<prov-state>' +
                sender_info.state_code +
                '</prov-state>\r\n\t\t\t\t<postal-zip-code>' +
                sender_info.postal_code +
                '</postal-zip-code>\r\n\t\t\t</address-details>\r\n\t\t</sender>\r\n\t\t<destination>\r\n\t\t\t<name>' +
                customer_name +
                '</name>\r\n\t\t\t<address-details>\r\n\t\t\t\t<address-line-1>' +
                customer_info.address +
                '</address-line-1>\r\n\t\t\t\t<city>' +
                customer_info.city +
                '</city>\r\n\t\t\t\t<prov-state>' +
                customer_info.state_code +
                '</prov-state>\r\n\t\t\t\t<country-code>' +
                customer_info.country_code +
                '</country-code>\r\n\t\t\t\t<postal-zip-code>' +
                customer_info.postal_code +
                '</postal-zip-code>\r\n\t\t\t</address-details>\r\n\t\t</destination>\r\n\t\t<options>\r\n\t\t\t<option>\r\n\t\t\t\t<option-code>DC</option-code>\r\n\t\t\t</option>\r\n\t\t</options>\r\n\t\t<parcel-characteristics>\r\n\t\t\t<weight>2</weight>\r\n\t\t\t<dimensions>\r\n\t\t\t\t<length>15</length>\r\n\t\t\t\t<width>12</width>\r\n\t\t\t\t<height>15</height>\r\n\t\t\t</dimensions>\r\n\t\t</parcel-characteristics>\r\n\t\t<preferences>\r\n\t\t\t<show-packing-instructions>true</show-packing-instructions>\r\n\t\t</preferences>\r\n\t\t<references>\r\n\t\t\t<cost-centre>ccent</cost-centre>\r\n\t\t\t<customer-ref-1>custref1</customer-ref-1>\r\n\t\t\t<customer-ref-2>custref2</customer-ref-2>\r\n\t    </references>\r\n\t</delivery-spec>\r\n</non-contract-shipment>';

            var config = {
                method: 'POST',
                url: `${CANADA_POST.HOST}/rs/${CANADA_POST.CUSTOMER}/ncshipment`,
                headers: {
                    Authorization: CANADA_POST.TOKEN,
                    'Accept-language': 'en-CA',
                    'Content-Type': 'application/vnd.cpc.ncshipment-v4+xml',
                    Accept: 'application/vnd.cpc.ncshipment-v4+xml',
                },
                data,
            };

            const result = await axios(config);
            return result.data;
        } catch (err) {
            console.log('err', err);
            return null;
        }
    };

    getLabelFromCanadaPost = async (url, shipping_id, seller_email, seller_name, product_name, order_date, buyer_name, buyer_address) => {
        try {
            const writer = fs.createWriteStream(
                `${path.join(`src/assets/shipping-label/${shipping_id}.pdf`)}`
            );

            var config = {
                method: 'GET',
                url,
                headers: {
                    Authorization: CANADA_POST.TOKEN,
                    'Accept-language': 'en-CA',
                    'Content-Type': 'application/vnd.cpc.ncshipment-v4+xml',
                    Accept: 'application/pdf',
                },
                responseType: 'stream',
            };

            const result = await axios(config);
            result.data.pipe(writer);

            writer.on('finish', async () => {
                const StrHTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                   <head>
                      <link href="https://fonts.googleapis.com/css?family=PT+Sans:400,700&amp;display=swap" rel="stylesheet" />
                      <style>* { font-family: "PT Sans"; } a { border: none; color: rgb(27, 128, 196); text-decoration: none; } a:hover { text-decoration: underline; } a:active,a:visited,a:focus { border: none; } </style>
                   </head>
                   <body style="padding: 10px; margin: 0px; background-color: #ffffff; color: #555555; font-size: 13px;">
                      <table border="0" cellspacing="0" width="100%" style="margin: 0; padding: 0; margin: auto;">
                         <tr>
                            <td></td>
                            <td width="650">
                               <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="border: 2px solid #e1e1e1;">
                                  <tr style="background: #17a2b8 none repeat scroll 0 0;">
                                     <td style="padding: 0px; margin: 0; vertical-align: middle;">
                                        <table width="100%" border="0" cellspacing="10" cellpadding="0">
                                           <tr>
                                              <td valign="middle" style="text-align: right; font-size: 16px; margin: 0; padding: 0; color: #fff;">Shipping Label - Inani Hub</td>
                                           </tr>
                                        </table>
                                     </td>
                                  </tr>
                                  <tr>
                                     <td style="padding: 14px 14px 2px 14px;">Congratulations ${seller_name},<br /><br />You have just sold an item on Inani with the description below.</td>
                                  </tr>
                                   <tr>
                                     <td style="padding: 0px 14px 2px 14px;"><b>Product Name:</b> ${product_name}</td>
                                  </tr>
                                  <tr>
                                     <td style="padding: 0px 14px 2px 14px;"><b>Order Date:</b> ${order_date}</td>
                                  </tr>
                                  <tr>
                                     <td style="padding: 0px 14px 2px 14px;"><b>Buyer's Name:</b> ${buyer_name}</td>
                                  </tr>
                                  <tr>
                                     <td style="padding: 0px 14px 2px 14px;"><b>Shipping Address:</b> ${buyer_address}</td>
                                  </tr>
                                  <tr>
                                     <td style="padding: 12px 14px 12px 14px;"><b style="text-decoration: underline;">Next steps</b>
                                     <ul>
                                         <li>Review the product sold and confirm it is still in stock and available to be shipped.</li>
                                         <li>Print the shipping label attached to this email.</li>
                                         <li>Package the item properly with the shipping label attached.</li>
                                         <li>Drop off the packaged item at your nearest Canada post office.</li>
                                     </ul>
                                     </td>
                                  </tr>
                                  <tr>
                                     <td style="padding: 0px 14px 2px 14px;">Inani expects its sellers to ship sold items within 2 business days. After delivery, we will credit your bank account with your proceeds of your sale when the buyer confirms the item.</td>
                                  </tr>
                                  <tr>
                                     <td style="padding: 12px 14px 12px 14px;"><b style="text-decoration: underline;">IMPORTANT</b>
                                     <ul>
                                         <li>You are responsible for the accuracy and content of the product you are about to ship.</li>
                                         <li>Any weight over 1.5kg attracts a new shipping label and it is subject to extra fees which will be deducted from your final earnings</li>
                                     </ul>
                                     </td>
                                  </tr>
                                  <tr>
                                     <td style="padding: 0px 14px 12px 14px;">
                                        <p style="margin: 10px 0px 3px 0px; padding: 0;"><strong>Thanks &amp; Regards</strong></p>
                                        <p style="margin: 0px; padding: 0; font-size: 12px; color: #868686;">Inani Hub</p>
                                     </td>
                                  </tr>
                               </table>
                            </td>
                            <td></td>
                         </tr>
                      </table>
                   </body>
                </html>`;

                StrHTML.replace('sellerName', 'Yash Sonani');
                StrHTML.replace('productName', 'Levi jeans');
                StrHTML.replace('orderDate', 'Yash Sonani');
                StrHTML.replace('buyerName', 'Yash Sonani');
                StrHTML.replace('shippingAddress', 'Yash Sonani');

                sendEmail(
                    seller_email,
                    'Your new order shipping label - Inani Hub',
                    null,
                    StrHTML,
                    [
                        {
                            filename: `shipping_label_${shipping_id}.pdf`,
                            path: `${path.join(`src/assets/shipping-label/${shipping_id}.pdf`)}`,
                        },
                    ]
                );

                // const poppler = new Poppler();
                // const options = {
                //     firstPageToConvert: 1,
                //     pngFile: true,
                // };
                // const outputFile = `${path.join(`src/assets/shipping-label/image-file/${shipping_id}`)}`;

                // await poppler.pdfToCairo(`${path.join(`src/assets/shipping-label/${shipping_id}.pdf`)}`, outputFile, options);

                // sharp(`${path.join(`src/assets/shipping-label/image-file/${shipping_id}-1.png`)}`)
                //     .extract({ left: 840, top: 0, width: 811, height: 1275 })
                //     .toFile(`src/assets/shipping-label/cut-file/${shipping_id}.png`, function (err) {
                //         if (err) console.log(err);
                //         sendEmail(
                //             seller_email,
                //             'Your new order shipping label - Inani Hub',
                //             null,
                //             `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><link href="https://fonts.googleapis.com/css?family=PT+Sans:400,700&amp;display=swap" rel="stylesheet" /><style>* { font-family: "PT Sans"; } a { border: none; color: rgb(27, 128, 196); text-decoration: none; } a:hover { text-decoration: underline; } a:active,a:visited,a:focus { border: none; } </style></head><body style="padding: 10px; margin: 0px; background-color: #ffffff; color: #555555; font-size: 13px;"><table border="0" cellspacing="0" width="100%" style="margin: 0; padding: 0; margin: auto;"><tr><td></td><td width="650"><table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="border: 2px solid #e1e1e1;"><tr style="background: #17a2b8 none repeat scroll 0 0;"><td style="padding: 0px; margin: 0; vertical-align: middle;"><table width="100%" border="0" cellspacing="10" cellpadding="0"><tr><td style="text-align: left; margin: 0; padding: 0; width: 150px;"><img src="logo.png" alt="" title="" style="margin: 0; padding: 0; display: block; border: none; height: 20px;" /></td><td valign="middle" style="text-align: right; font-size: 16px; margin: 0; padding: 0; color: #fff;">Shipping Label.</td></tr></table></td></tr><tr><td style="padding: 14px 14px 12px 14px;">Dear seller,<br /><br />We have attached shipping label with this email.<br />Print the label and attach with delivery parcel.</td></tr><tr><td style="padding: 0px 14px 12px 14px;"><p style="margin: 10px 0px 3px 0px; padding: 0;"><strong>Thanks &amp; Regards</strong></p><p style="margin: 0px; padding: 0; font-size: 12px; color: #868686;">Inani Hub</p></td></tr></table></td><td></td></tr></table></body></html>`,
                //             [
                //                 {
                //                     filename: `shipping_label_${shipping_id}.png`,
                //                     path: `${path.join(`src/assets/shipping-label/cut-file/${shipping_id}.png`)}`,
                //                 },
                //             ]
                //         );
                //     })
            });
            writer.on('error', () => console.error('Error while dowloading image'));
        } catch (err) {
            return null;
        }
    };
}

export default CanadaPostService;
