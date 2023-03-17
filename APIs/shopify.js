require('dotenv').config();
const Shopify = require('shopify-api-node');

const shopify = new Shopify({
    shopName: process.env.SHOP_NAME,
    accessToken: process.env.ACCESS_TOKEN,
    autoLimit: true
});

module.exports = {
    shopify
}