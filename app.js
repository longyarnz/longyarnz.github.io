/**
 * @fileOverview Hackerbay_Backend API that allows users to login,
 * patch json objects and resize images to 50 &times; 50
 */
import express from 'express';
import jwt from 'jsonwebtoken';
import jsonPatch from 'json-patch';
import bodyParser from 'body-parser';
import multer from 'multer';
import fetch from 'node-fetch';
import UUID from 'uuid';
import path from 'path';
import sharp from 'sharp';
import logger from './src/logger';
import tokenParser from './src/tokenParser';


/**
 * @constant {number} PORT
 */
const PORT = process.env.PORT || 3000;

/**
 * @description Creates an express application
 * @constant {object}
 */
const app = express();

/**
 * @description Add body-parser middleware for parsing request body to text, json, url object or form data
 * @function EXPRESS_USE_MIDDLEWARE
 * @param {middleware} body-parser A middleware for parsing request body to functional data type
 */
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(multer().array());

/**
 * @description This is a scoped server constant that stores the key to sign a request token for a session
 * 
 * @constant {UUID}
 */
const SERVER_KEY = UUID.v4();

/**
 * @description This is a scoped server constant that stores the value of a request token for a session
 * 
 * @constant {UUID}
 */
let SERVER_TOKEN;


/**
 * @description This is an express application POST method for the "/api/login" route
 * @function POST_TO_LOGIN
 * @param {string} route An API route to login
 * @param {API_ROUTES_CALLBACK} callback - Callback for post method to routes
 * @returns {Response} JSON
 */
app.post('/api/login', (req, res) => {
  try{
    /**
     * @description Destructure and assign arbitrary username and password from Request
     */
    const { username, password } = req.body;
    
    /**
     * @description Test for data input
     */
    if(!username || !password){
      throw new Error('Invalid Username or Password');
    }

    /**
     * @description Test for data validity
     */
    else if(typeof(username) !== 'string' || typeof(password) !== 'string'){
      throw new Error('Username and Password must be of STRING type');
    }
    
    else{
      /**
       * @description Create JWT token from username and password
       */
      jwt.sign({ username, password }, SERVER_KEY, (err, token) => {
        const message = {
          text: 'User log-in successful',
          token,
          user: {
            username,
            password
          }
        };

        /**
         * @description Store token in server constant
         */
        SERVER_TOKEN = token;

        /**
         * @description Return token, username and password
         */
        res.json(message);
      });
    }
  }
  catch(err){
    logger.error(err);
    res.status(403).send(err.message);
  }
});


/**
 * @description This is an express application POST method for the "/api/patch" route
 * @function POST_TO_PATCH
 * @param {string} route - An API route to patch JSON objects
 * @param {function(): string} tokenParser - Parses the token stored in the request header
 * @param {API_ROUTES_CALLBACK} callback - Callback for post method to routes
 * @returns {Response} JSON
 */
app.post('/api/patch', tokenParser, (req, res) => {
  let patchedJson;

  /**
   * @description Verify the validity of the Request token
   */
  jwt.verify(req.token, SERVER_KEY, (err) => {
    try{

      /**
       * @description Reject if token is invalid
       */
      if(err || req.token !== SERVER_TOKEN) {
        throw new Error('Invalid Token.');
      }

      else{
        const { jsonObject, patch } = req.body;

        /**
         * Validate the data type of json patch
         */
        if(!Array.isArray(patch)){
          throw new Error('Invalid Patch.');
        }

        else{
          patchedJson = jsonPatch.apply(jsonObject, patch);
          const message = {
            text: 'Patch Applied...',
            token: req.token,
            patchedJson
          };

          /**
           * @description Return patched JSON object
           */
          res.json(message);
        }
      }
    }
    catch(err){
      logger.error(err);
      res.status(403).send(err.message);
    }
  });
});


/**
 * @description This is an express application POST method for the "/api/getThumbnail" route
 * @function POST_TO_GET_THUMBNAIL
 * @param {string} route An API route to get thumbnails
 * @param {function(): string} tokenParser - Parses the token stored in the request header
 * @param {API_ROUTES_CALLBACK} callback - Callback for post method to routes
 * @returns {Response} 
 */
app.post('/api/getThumbnail', tokenParser, (req, res) => {
  jwt.verify(req.token, SERVER_KEY, (err) => {
    try{

      /**
       * @description Reject if token is invalid
       */
      if(err || req.token !== SERVER_TOKEN) {
        throw new Error('Invalid Token Sent');
      }

      else{
        const { url } = req.body;

        /**
         * @description Fetch Image file 
         * @function fetch
         * @param {string} URL A URL to fetch an image from remote server
         */
        fetch(url)
          .then(response => {
            let location = 'public_image.jpg';
            /**
             * @description Buffer fetch response
             */
            response.buffer()
              .then(buffer => {

                /**
                 * @description Initialize the sharp module with response.buffer object
                 * @function sharp
                 * @param {buffer} Buffer - Buffer from the response of the fetch request
                 * @returns {blob}
                 */
                sharp(buffer)

                  /**
                   * @description Resize buffered image
                   */
                  .resize(50, 50)

                  /**
                   * @description Save bufferef image to file
                   */
                  .toFile(location, err => {
                    try{

                      /**
                       * @description Test for validity of buffered image
                       */
                      if(err) {
                        logger.error(err);
                        throw new Error('Invalid Image URL was given');
                      }

                      /**
                       * @description Return image file to user
                       */
                      else{
                        location = path.join(__dirname, location);
                        res.sendFile(location);
                      }
                    }
                    catch(err){
                      logger.error(err);
                      res.status(403).send(err.message);
                    } 
                  }); 
              });
          })
          .catch(err => {
            logger.error(err);
            res.status(403).send(err.message);
          });
      }
    }
    catch(err){
      logger.error(err);
      res.status(403).send(err.message);
    }
  });
});

/**
 * @description Let express application listen on dedicated PORT
 */
app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));

export default app;


/**
 * This is the API routes callback
 * @callback API_ROUTES_CALLBACK
 * @param {Request} request - Server request to express application
 * @param {Response} response - Server response to after processing request
 */