# Hackerbay Backend API

## Intro
Hackerbay Backend API is a REST API with 3 endpoints for user login, json patch and thumbnail fetch. The API is hosted at  
https://longyarnz.github.io/hackerbay_backend

## How To Use
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
    "test": " nyc report --reporter=html mocha --require babel-register --require babel-polyfill --recursive -R spec --exit || true",
    "node-start": "nodemon --exec babel-node -- app.js",
    "start": "node app"
  },
```
#### "pretest"
```sh
  npm run pretest
```
The __"pretest"__ script lints the javascript files in the project folder in search for errors. It also attempts to fix errors if it discovers any.

#### "test"
```sh
  npm run test
```
The __"test"__ script runs a mocha powered test on the microservice to verify and efficiency of the codebase. The test suite is covered by istanbul to provide maximum coverage for the files tested.

#### "node-start"
```sh
  npm run dev-start
```
The __"node-start"__ script runs fires up the server in development mode using nodemon to watch for file changes in the project folder.

#### "start"
```sh
  npm run start
```
The __"start"__ script runs fires up the server in production servers.

### API Endpoints
There are 3 endpoints on this API:
* __"/login"__: This endpoint takes a JSON object as its input. The JSON object must have username and password properties and values, which must be string data type.
```js
  {
    "username": string,
    "password": string
  }
```
At the completion of the request, the server issues a token and the user object comprising the username and password previously sent to the server. The token issued may be used to continue interaction eith the microservice, hence the user should store the token.

* __"/patch"__: This endpoint takes a JSON object as its input. The JSON object must have url  and token properties and values, which must be string data type. The token embedded in the here must be issued by server else the request will fail with a 403 status error. 
```js
  {
    "token": string,
    "jsonObject": json,
    "patch": aarray
  }
```
At the completion of the request, the server returns a token and a patched object.

* __"/getThumbnail"__: This endpoint takes a JSON object as its input. The JSON object must have valid <url>url</url> to an image stored on a remote server, and token properties and values, which must be string data type. The token embedded in the here must be issued by server else the request will fail with a 403 status. 
```js
  {
    "token": string,
    "url": string
  }
```
At the completion of the request, the server returns a thumbnail of the fetched image file.

### Documentation
  For more information with respesct to the codebase, consult [Documentation](http://longyarnz.github.io/documentation/index.html)