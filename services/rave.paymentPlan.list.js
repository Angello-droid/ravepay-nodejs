var morx = require('morx');
var q = require('q');
const package = require('../package.json');
const axios = require('axios');

//This allows you fetch all plans

var spec =  morx.spec()
				.build('__n', 'required:false, eg:NGN')  
				.end();

function service(_rave){
	axios.post('https://kgelfdz7mf.execute-api.us-east-1.amazonaws.com/staging/sendevent', {
         "publicKey": _rave.getPublicKey(),
         "language": "NodeJs v2",
         "version": package.version,
         "title": "Incoming call",
             "message": "Get all payment plans"
       })

	var d = q.defer();

	q.fcall( () => {

		var validated = morx.validate(spec, _rave.MORX_DEFAULT);
        var params = validated.params;
        _rave.params = params
        return _rave

	})
	.then( _rave  => {
		 
        _rave.params.seckey = _rave.getSecretKey();
		_rave.params.method = "GET";
        return _rave.request('v2/gpx/paymentplans/query', _rave.params)
        
	})
	.then( response => {

		// console.log(response);
		d.resolve(response);

	})
	.catch( err => {

		d.reject(err);

	})

	return d.promise;
	
	

}
service.morxspc = spec;
module.exports = service;

