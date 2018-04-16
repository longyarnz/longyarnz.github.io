/**
 * @fileOverview tokenParser is a middleware that extracts token bearer from the headers of a request. 
 * The token is parsed is piped to the next callback.
 * @exports tokenParser
 */
export default (req, res, next) => {
  req.token = req.headers['authorization'];
  next();
};