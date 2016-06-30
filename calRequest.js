var request = require('request'); // require request
var jobID; // string to hold job ID
var sherlockEndpoint = "http://calhadoop-vip-a.slc.paypal.com/regex/request/"; // generic sherlock search endpoint url
var mongoose = require('mongoose');
var db = mongoose.connection;
   
var dataSchema = new mongoose.Schema({
        
    values : {
        Command : String,
        Status : Number,
        Machine : String,
        Type : String,
        Class : String,
        Duration : String,
        Pool : String,
        Timestamp : String
    },
    url : String,
    payload : String
});

submitRequest();

function submitRequest() {
    request.post(
            'http://calhadoop-vip-a.slc.paypal.com/regex/request',
            {
                json: { // example search input
                          "startTime":"2016/06/27 18:00",
        "endTime":"2016/06/27 18:30",
        "environment":"paypal",
        "pool": "partnerapiplatformserv",
        "dataCenter":"all",
        "machine":"",
        "sampling":"100",
        "regexs":["ResponseCode=200"],
        "isTransactionSearch":"false",
        "searchMode":"simple",
        "httpCallback":"http://hyperlvs14:9090/?id=$id&status=$status",
        "email":"janwu@paypal.com"
                      }
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) { // no errors
                    console.log("Job ID : " + body); // prints out job ID
                    jobID = body; // store job ID

                    getStatus();
                }

                else {
                    console.log(response.statusCode); // error code
                }
            }

    )};


function getStatus() {
    request(sherlockEndpoint + jobID, function (error, response, body) {

        if (!error && response.statusCode == 200) {

            // console.log(sherlockEndpoint+jobID); // print out the url


            var responseObj = JSON.parse(body); // turn into JSON object
            console.log("Status : " + responseObj.requestState); // debug

            if (responseObj.requestState != "SUCCEEDED") {
                setTimeout(getStatus, 1000); // if not succeeded yet, wait one second and call method again
            }

            else {
                
                console.log(body); 
                getDetail(sherlockEndpoint + jobID); // get results

            }

        }

        else {
            console.log(response.statusCode);
        }
    })}

function getDetail(endpoint)
{
    request(endpoint + "/output", function (error, response, body) {

        console.log(endpoint); // print out url

        if (!error && response.statusCode == 200) {

            //console.log(sherlockEndpoint+jobID);

            var details = JSON.parse(body);
            console.log("Details : " + JSON.stringify(details, null, 4)); // print information in a formatted way


            var eventDetailURL = details.records[0].url; // gets url field from first response (for testing)

            var rawLogsURL = eventDetailURL.replace("eventDetail", "rawLogs"); // new url leads to plain text raw logs page instead of html page

            // console.log(rawLogsURL); 

            getRawLogs(details, rawLogsURL); // get the raw logs page

        }

        else {
            console.log(response.statusCode);
        }
    })
}

function getRawLogs(details, url) {

    request(url, function(error, response, body) {

        if(!error && response.statusCode == 200){

            // console.log(body); // print page
            insertMongo(details, body); // insert everything into mongodb

        }

        else {
            console.log(response.statusCode);
        }

    });
    
}

function insertMongo(response, p) {

    mongoose.connect('mongodb://localhost/test'); 

    db.on('error', console.error);
    db.once('open', function() {

        var Element = mongoose.model('Element', dataSchema);

        var sampleResponse = new Element(response.records[0]); // gets the first element from the list of responses (for testing)

        sampleResponse.payload = p; // add payload onto the response JSON object

        sampleResponse.save(function(err, sampleResponse) { // save to mongoDB
 
            if (err) {
                return console.error(err);
            }

            console.log("Element inserted into mongoDB database : " + JSON.stringify(sampleResponse, null, 4));


            db.close();
        });

    });
}
