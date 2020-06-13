# SHOP Rest API (under construction)
Basic model of a shop api, where users can be either clients or managers.

## How to Run
### Requirements
- node.
- npm ('npm install' will download all the packages).
- MongoDB account (free).
### Running the App
- on '.env' file, replace the value of 'MONGODB_URL' with the path to yours. 
- the server is set to use port 9090. You can change it on the first line of 'server.js' file.
- 'npm run app' will start the app. You can then use Postman to http requests. 
### Running the Unitary Tests
- 'npm run unit-tests' will run all unitary tests. 
### Running the Integration Tests
- 'npm run integration-tests' will run all unitary tests.

## HTTP Routes
- API endpoint: http://localhost:9090
- 'Get' request on '/' and '/api' will return greeting messages
- 'Post' request on '/api/managers' will create a new manager. This request requires a body with the json attributes 'name', 'email' and 'password'. The reponse generates and Id.
- 'Post' request on '/api/managers/login' will login as a manager. This request requires a body with the json attributes 'email' and 'password' of a created manager. An authentication token is returned in the response header.
- 'Put' request on '/api/managers/:manager_id' will update a manager info. This request requires a body with the json attribute you want to add/update (remember to replace ':manager_id' with a valid id). An authentication token must be provided in the request reader (key = auth-token) for the update to be authorized.
- 'Get' request on '/api/managers/:manager_id' will retrieve a manager info (remember to replace ':manager_id' with a valid id).
- 'Get' request on '/api/managers' will retrieve all managers info.
- 'Delete' request on '/api/managers/:manager_id' will delete a manager from database (remember to replace ':manager_id' with a valid id).

## HTML Reports
- html reports can be found on ./test/reports folder.