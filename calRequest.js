var request = require('request'); // require request
var jobID; // string to hold job ID
var sherlockEndpoint = "http://calhadoop-vip-a.slc.paypal.com/regex/request/"; // generic sherlock search endpoint url

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
                    console.log(body); // prints out job ID
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

        // console.log("i am here"); // to debug

        if (!error && response.statusCode == 200) {

            console.log(sherlockEndpoint+jobID); // print out the url


            var responseObj = JSON.parse(body); // turn into JSON object
            console.log(responseObj.requestState); // debug

            if (responseObj.requestState != "SUCCEEDED") {
                setTimeout(getStatus, 1000); // if not succeeded yet, wait one second and call method again
            }

            else {
                // console.log("is it succeeded"); // to debug
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
            console.log(JSON.stringify(details, null, 4)); // print information in a formatted way


            var eventDetailURL = details.records[0].url; // gets url field from first response (for testing)

            var rawLogsURL = eventDetailURL.replace("eventDetail", "rawLogs"); // new url leads to plain text raw logs page instead of html page

            console.log(rawLogsURL); 

            getRawLogs(rawLogsURL); // get the raw logs page

        }

        else {
            console.log(response.statusCode);
        }
    })
}

function getRawLogs(url) {

    request(url, function(error, response, body) {

        if(!error && response.statusCode == 200){

            console.log(body); // print page

        }

        else {
            console.log(response.statusCode);
        }

    });

}
