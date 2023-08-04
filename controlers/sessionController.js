const secretKey = 'mysecretkey';
const jwt = require('jsonwebtoken');

const Session = async (req, res, next) => {
    if (req.headers["authorization"]) {
      
      const authToken = req.headers['authorization'].split(' ')[1];
      
      try {
        jwt.verify(authToken, secretKey, (err, decodedToken) => {
          if (err || !decodedToken) {
            res.status(401);
            res.json({
              error: "Unauthorized"
            });
          }
          console.log('Welcome', decodedToken.name);
          next();
        });
      } catch (e) {
        res.status(401);
        console.log(e);
        res.send({
          error: "Unauthorized "
        });
      }
    } else {
      res.status(401);
      res.send({
        error: "Unauthorized "
      });
    }
  };
  module.exports = {Session};
