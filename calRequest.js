var request = require('request'); // require request
var jobID; // string to hold job ID
var sherlockEndpoint = "http://calhadoop-vip-a.slc.paypal.com/regex/request/"; // generic sherlock search endpoint url

submitRequest();

function submitRequest() {
request.post(
        'http://calhadoop-vip-a.slc.paypal.com/regex/request',
        {
        json: {
                "startTime":"2016/06/26 18:00",
                "endTime":"2016/06/26 18:30",
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
                console.log(body); 

                var responseObj = JSON.parse(body); // turn into JSON object

                console.log(responseObj.requestState); // debug

                if (responseObj.requestState != "SUCCEEDED") {
                    setTimeout(getStatus, 1000); // if not succeeded yet, wait one second and call method again
                }

                else {
                    // console.log("is it succeeded"); // to debug
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

            console.log(details); // print information

        }

        else {
            console.log(response.statusCode);
        }
    })
}
