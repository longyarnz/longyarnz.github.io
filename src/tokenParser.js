/**
 * @fileOverview tokenParser is a middleware that extracts token bearer from the headers of a request. 
 * The token is parsed is piped to the next callback.
 * @exports tokenParser
 */
export default (req, res, next) => {
  const tokenHeader = req.headers['authorization'];
  const tokenBearer = tokenHeader.split(' ');
  const token = tokenBearer[1];
  req.token = token;
  next();
};