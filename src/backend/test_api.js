const mongoose = require('mongoose');

module.exports = function (req, res, next) {
  req.user = {
    _id: new mongoose.Types.ObjectId('680e01cefc32c787800251c7'), 
  };
  next();
};