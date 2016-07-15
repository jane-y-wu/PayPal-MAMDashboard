# PartnerOnboardingMonitoring-REST

REST service to provide CRUD operation in data retrieved from CAL API

###Code structure
Our API code is decomposed into 3 files:

 * `routes/index.js`
 * `routes/monitor-api-controller.js`
 * `services/monitor-api-service.js`

`routes/index.js` outlines all the URL patterns that our REST service will respond to. Each route calls a function defined in the `routes/monitor-api-controller.js` file.

`routes/monitor-api-controller.js` stores functions which process requests to the REST service. These functions in turn only call further functions defined in `services/monitor-api-service.js`, passing in a callback to be carried out, which either puts together a result and sends it to the client, or calls the next function in the chain of work.

`services/monitor-api-service.js` stores the final layer of functions used in processing a request. Most of the logic involved, such as parsing data from CAL and storing it into MongoDB occurs here.


###CAL/Sherlock Facing API:
**Route:** `app.get('/api/queryready/*', monitorApiController.getDetails);`

Any get request sent to an address of the form /api/queryready/... will prompt our service to run the `getDetails` function defined in `routes/monitor-api-controller.js`. This URL is called twice by the Sherlock API after recieving a query request. The first acknowledges that Sherlock has recieved a query with this URL passed in, the second informs us that the logs have been collected and are ready to access, as well as providing a Job ID through which we can access the logs. Using the Job ID we construct a URL that returns metadata about our query, as well as another URL. Calling this URL then returns the actual log.

Note that `getDetails` actually defines a function containing several functions, all of which are called sequentially in the workflow. Each of these functions calls a corresponding function in `services/monitor-api-service.js`, passing in a callback function that calls the next function in the workflow.



###Client Facing API:

