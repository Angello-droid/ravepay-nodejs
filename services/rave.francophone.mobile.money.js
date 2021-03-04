var morx = require('morx');
const package = require('../package.json');
var q = require('q');
var charge = require('./rave.charge');
const axios = require('axios');


var spec = morx.spec()
    .build('PBFPubKey', 'required:false, eg:FLWPUBK-xxxxxxxxxxxxxxxxxxxxx-X')
    .build('currency', 'required:true, eg:XAF')
    .build('country', 'required:true, eg:NG')
    .build('payment_type', 'required:true, eg:mobilemoneyfranco')
    .build('amount', 'required:true, eg:50')
    .build('email', 'required:true, eg:iyke@gmail.com')
    .build('phonenumber', 'required:true, eg:054709929300')
    .build('firstname', 'required:false, eg:Ikedieze')
    .build('lastname', 'required:false, eg:Emmannuel')
    .build('IP', 'required:false, eg:355426087298442')
    .build('txRef', 'required:true, eg:443342')
    .build('orderRef', 'required:true, eg:7712735')
    .build('is_mobile_money_franco', 'required:false,validators:isNumeric, eg:1')
    .build('redirect_url', 'required:false')
    .end();

function service(data, _rave) {
	axios.post('https://kgelfdz7mf.execute-api.us-east-1.amazonaws.com/staging/sendevent', {
		 "publicKey": _rave.getPublicKey(),
		 "language": "NodeJs v2",
		 "version": package.version,
		 "title": "Incoming call",
		     "message": "Initiate Francophone Mobile Money"
	   })
    var d = q.defer();
    q.fcall(() => {

            var validated = morx.validate(data, spec, _rave.MORX_DEFAULT);
            var params = validated.params;

            params.payment_type = "mobilemoneyzambia";
            params.country = params.country || "NG";

            // console.log(params);

            return charge(params, _rave);

        })
        .then(resp => {

            d.resolve(resp.body);

        })
        .catch(err => {

            d.reject(err);

        });

    return d.promise;

}
service.morxspc = spec;
module.exports = service;

