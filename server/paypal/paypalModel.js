var mongoose = require('mongoose');
var crypto   = require('crypto');

var PaypalSchema = new mongoose.Schema({
  cmd: String,
  mc_gross: Number,
  protection_eligibility: String,
  address_status: String,
  payer_id: String,
  tax: Number,
  address_street: String,
  payment_date: String,
  payment_status: String,
  charset: String,
  address_zip: String,
  first_name: String,
  mc_fee: Number,
  address_country_code: String,
  address_name: String,
  notify_version: String,
  custom: String,
  payer_status: String,
  address_country: String,
  address_city: String,
  quantity: Number,
  verify_sign: String,
  payer_email: String,
  txn_id: String,
  payment_type: String,
  last_name: String,
  address_state: String,
  receiver_email: String,
  payment_fee: Number,
  receiver_id: String,
  txn_type: String,
  item_name: String,
  mc_currency: String,
  item_number: String,
  residence_country: String,
  test_ipn: String,
  handling_amount: Number,
  transaction_subject: String,
  payment_gross: Number,
  shipping: Number
});



module.exports = mongoose.model('Paypal', PaypalSchema);
