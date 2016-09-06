# PartnerOnboardingMonitoring-REST

REST service to provide CRUD operation in data retrieved from CAL API

###CAL/Sherlock Facing API:
**GET** `/api/queryready/?id={id}&status={status}`

Informs the service that CAL has either recieved a log retrieval request, or has finished collecting the results of a request and is ready to send them. If status is "SUCCEEDED", the service will begin the process of using the provided Job ID to pull data from CAL.


####Parameters

| Field  | Type   | Location | Description                                                         |
|--------|--------|----------|---------------------------------------------------------------------|
| id     | string | path     | Job ID returned by CAL                                              |
| status | string | path     | Status of log retrieval request. Either "SUBMITTED" or "SUCCEEDED". |


###Client Facing API:

**POST** `/api/getLogs?startDate={startDate}&endDate={endDate}`

Asks the service to retrieve and return all stored logs in the MongoDB between the startDate and endDate (inclusive).

####Parameters

| Field     | Type   | Location | Description                           |
|-----------|--------|----------|---------------------------------------|
| startDate | string | path     | Beginning of date range to query over |
| endDate   | string | path     | End of date range to query over       |


**GET** `/api/getSingleLog/?logID={logID}`

Asks the service to return a single log matching the provided logID.

| Field   | Type   | Location | Description      |
|---------|--------|----------|------------------|
| logID   | string | path     | Log ID to return |


**GET** `/api/getErrorCount/?startDate={startDate}&endDate={endDate}&error={error}`