# PartnerOnboardingMonitoring

A monitoring dashboard fo MAM API. PartnerOnboardingMonitoring is a Summer intern 2016 project which aims to build a tool to monitor MAM API. This tool will search CAL logs for configured error patterns and present daily and monthly trends.

## Requirements

The app runs using NodeJS, so you will need to install Node before you can install and run the app. We are running on node V0.12.2

## Installation

1. cd `PartnerOnboardingMonitoring-REST`
2. npm install
3. cd `PartnerOnboardingMonitoring-app`
4. npm install
5. cd `PartnerOnboardingMonitoring-batch`
6. npm install
7. cd `PartnerOnboardingMonitoring\models`
8. npm install

## Running the App

The app consists of 4 components:

 - Batch: Queries CAL every hour for new logs. This triggers the service to pull these new logs from CAL
 - Service: Pulls logs from CAL into a MongoDB every hour. Sends data for the Client to display
 - Client: Displays data through a web application
 - MongoDB: Where the logs are stored locally

### Setup

To run the app, you will need to make sure that the 4 components outlined above are pointing correctly to each other.

##### Service 

Located in `PartnerOnboardingMonitoring-REST`

The actual URL the service is located at depends on where you are running the code from. For example, when we run our service from our own C3 instance, it is located at the URL 'http://partner-self-service-6103.ccg21.dev.paypalcorp.com'. The service port number is configured in the `app.js` file:

	app.set('port', process.env.PORT || 3004);

Replace `3004` with your own port number if you please. The service URL and port number are important because the Client will need to reference them to connect to the service.

The service also connects to the MongoDB directly. This is done in `PartnerOnboardingMonitoring\models\db.js`. To connect to your own MongoDB, edit the following lines of code:

	var url = 'mongodb://10.25.39.2:27017/admin';
	...

	mongoose.connect(url, {user: 'root', pass: 'fKMjMPjgF2jMQEdRx323euyqZMqzpCNB!KB6'}, function(){
		console.log('Mongoose Connected');
	});

Replace the URL with your own MongoDB url, and 'user' and 'pass' with your own username and password.


##### Batch

Located in `PartnerOnboardingMonitoring-batch`

Now that you know your Service's URL and port number, you attach this to CAL request sent through the batch process. in `batch.js`, modify the following lines of code to point towards your own Service's location:

	var serverURL = 'http://partner-self-service-6103.ccg21.dev.paypalcorp.com';
	var portNo = '3004';

Additionally, insert your own email address into the request:

    request.post(
		...
    	json: {
		...
        	"email": // Insert Email Here
		}
	...
	);
	
##### Client

Located in `PartnerOnboardingMonitoring-app`

The Client interacts only with the Service. It does this through API calls in the file `src/js/actions/LogActions.js`. Modify the following lines of code to point towrads your own Service's location:

	var serverURL = 'http://partner-self-service-6103.ccg21.dev.paypalcorp.com';
	var portNo = '3004';


### Starting it up
 
If you wish to run the application manually, you just need to make sure all 4 components will are running.

1. `cd PartnerOnboardingMonitoring-REST`
2. `node app.js`
3. `cd PartnerOnboardingMonitoring-app`
4. `npm start`
5. `cd PartnerOnboardingMonitoring-batch`
6. `node batch.js`

If you choose to connect to your own MongoDB, make sure that is running too.

If you want to actually start up the service and have it run indefinitely, you can use a tool called PM2. Assuming you have node installed, you can install pm2 globally on your machine.

	npm install -g pm2

1. `cd PartnerOnboardingMonitoring-REST`
2. `pm2 start app.js`
3. `cd PartnerOnboardingMonitoring-app`
4. `pm2 start ./node_modules/webpack-dev-server/bin/webpack-dev-server.js -- --content-base src --inline --hot --host 0.0.0.0`
5. `cd PartnerOnboardingMonitoring-batch`
6. `pm2 batch.js`

More information about managing pm2 processes can be found [here](http://pm2.keymetrics.io/docs/usage/quick-start/).

Finally, navigate to `http://localhost:8080/` if you are running the app locally, or to the appropriate URL otherwise. By default the Client runs on port 8080. This can be adjusted by adding a `--port [PORT NUMBER]` option when starting the Client.

## Customizing/Extending the App

09/06/2016

The app is currently designed to log 3 types of errors:

	'INTERNAL_SERVICE_ERROR', 'VALIDATION_ERROR', 'SERVICE_TIMEOUT'
	
To customize the errors pulled from CAL and stored in the MongoDB, first modify the `batch.js` file:

	var regexsField = ['INTERNAL_SERVICE_ERROR', 'VALIDATION_ERROR', 'SERVICE_TIMEOUT'/*, add additional search terms here */]; 
	
Then modify `PartnerOnboardingMonitoring-REST/services/monitor-api-service.js` and `PartnerOnboardingMonitoring-REST/services/monitor-api-service-aggregation.js`:
	
	var errorNames = ["VALIDATION_ERROR", "INTERNAL_SERVICE_ERROR", "SERVICE_TIMEOUT"/*, add additional search terms here */];
	

## Testing

We've also included a test suite for the Service. Note that this is only for testing the API endpoints of the Service, and does not test the Batch or the Client. To run the tests, first install Mocha:

	npm install -g mocha

Then navigate to `PartnerOnboardingMonitoring-REST/test` and run `mocha tests.js`. Additional tests can be added in the `tests.js` file.

