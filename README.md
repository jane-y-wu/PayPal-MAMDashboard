# PartnerOnboardingMonitoring

A monitoring dashboard fo MAM API. PartnerOnboardingMonitoring is a Summer intern 2016 project which aims to build a tool to monitor MAM API. This tool will search CAL logs for configured error patterns and present daily and monthly trends.

## Requirements

The app runs using NodeJS. You'll need to install Node before you can install and run the app. 

## Installation

1. cd `PartnerOnboardingMonitoring-app/PartnerOnboardingMonitoring-REST`
2. npm install
3. cd `PartnerOnboardingMonitoring-app/PartnerOnboardingMonitoring-app`
4. npm install
5. cd `PartnerOnboardingMonitoring-app/PartnerOnboardingMonitoring-batch`
6. npm install
7. cd `models`
8. npm install

## Running the App

The app consists of 4 components:

 - Batch: Queries CAL every hour for new logs. This triggers the service to pull these new logs from CAL
 - Service: Pulls logs from CAL into a MongoDB every hour. Sends data for the Client to display
 - Client: Displays data through a web application
 - MongoDB: Where the logs are stored locally

### Configuration

To run the app, you will need to make sure that the 4 components outlined above are pointing correctly to each other.

##### Service 
(`PartnerOnboardingMonitoring-app/PartnerOnboardingMonitoring-REST`)

### Starting it up
 

To run the full application, all 3 components will need to be running.

1. cd `PartnerOnboardingMonitoring-app/PartnerOnboardingMonitoring-REST`
2. node app.js
3. cd `PartnerOnboardingMonitoring-app/PartnerOnboardingMonitoring-app`
4. npm start
5. cd `PartnerOnboardingMonitoring-app/PartnerOnboardingMonitoring-batch`
6. node batch.js