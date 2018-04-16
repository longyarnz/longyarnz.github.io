# Hackerbay Backend API

## Intro
Hackerbay Backend API is a REST API with 3 endpoints for user login, json patch and thumbnail fetch. The project is hosted [here](https://longyarnz.github.io) on Github and the docker image is stored at [https://hub.docker.com/r/longyarnz/hackerbay_backend/](https://hub.docker.com/r/longyarnz/hackerbay_backend/)

### How To Use
In a development environment install dependencies. Run npm install in the project folder,
```sh
  npm install
```
or run yarn
```sh
  yarn
```
The dependies will be installed on your local machine.  

Then inspect the package,json file for the npm scripts embedded in it.
```json
  "scripts": {
    "pretest": "eslint --fix --ignore-path .gitignore .",
    "test": " nyc report --reporter=html mocha --require babel-register --recursive -R spec --exit || true",
    "dev": "nodemon --exec babel-node -- app.js",
    "start": "babel-node app"
  },
```
#### "pretest"
```sh
  npm pretest
```
The __"pretest"__ script lints the javascript files in the project folder in search for errors. It also attempts to fix errors if it discovers any.

#### "test"
```sh
  npm test
```
The __"test"__ script runs a mocha powered test on the microservice to verify the efficiency of the codebase. The test suite is covered by istanbul to provide maximum coverage for the files tested.

#### "dev"
```sh
  npm dev
```
The __"dev"__ script runs fires up the server in development mode using nodemon to watch for file changes in the project folder.

#### "start"
```sh
  npm start
```
The __"start"__ script runs fires up the server in production servers.

### API Endpoints
There are 3 endpoints on this API and they only accept __POST__ requests:
* __"http://localhost:3000/api/login"__: This endpoint takes a JSON object as its input. The JSON object must have username and password properties and values, which must be string data type.
#### Request payload
```js
  {
    "username": string,
    "password": string
  }
```
At the completion of the request, the server issues a token and a user object comprising the username and password previously sent to the server. The token received may be used to continue further interaction with the microservice, hence the user should store the token.

* __"http://localhost:3000/api/patch"__: This endpoint takes a JSON object as its input. The JSON object must have properties which include jsonObject and patch. The token received from the response of the __Login API__ must be embedded into the header of this request else the request will fail with a 403 status error. 
#### Request payload
```js
  {
    "jsonObject": json,
    "patch": array
  }
```
#### Embed Token into the request header
```js
  headers('Authorization', TOKEN_RECEIVED_FROM_LOGIN_API)
```
At the completion of the request, the server returns the token and a patched json object.

* __"http://localhost:3000/api/getThumbnail"__: This endpoint takes a JSON object as its input. The JSON object must have valid <url>url</url> to an image stored on a remote server. The token received from the response of the __Login API__ must be embedded into the header of this request else the request will fail with a 403 status. 
#### Request payload
```js
  {
    "url": string
  }
```
#### Embed Token into the request header
```js
  headers('Authorization', TOKEN_RECEIVED_FROM_LOGIN_API)
```

At the completion of the request, the server returns a thumbnail of the fetched image file.

### Documentation
  For more information with respect to the codebase, consult the JsDocs [Documentations](http://longyarnz.github.io/documentation/index.html)