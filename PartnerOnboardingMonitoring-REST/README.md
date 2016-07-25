# PartnerOnboardingMonitoring-REST

REST service to provide CRUD operation in data retrieved from CAL API

###CAL/Sherlock Facing API:
**GET** `/api/queryready/?id={id}&status={status}`

Informs the service that CAL has either recieved a log retrieval request, or has finished collecting the results of a request and is ready to send them.


####Parameters

| Field  | Type   | Location | Description                                                         |
|--------|--------|----------|---------------------------------------------------------------------|
| id     | string | path     | Job ID returned by CAL                                              |
| status | string | path     | Status of log retrieval request. Either "SUBMITTED" or "SUCCEEDED". |


###Client Facing API:

