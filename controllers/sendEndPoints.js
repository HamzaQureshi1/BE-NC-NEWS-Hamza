const {getEndPoints} = require('../models/getEndPoints')

exports.sendEndPoints = (req, res, next) => {
  getEndPoints()
    .then(endPoints =>
      res.status(200).send({ endPoints }))
    .catch(next)
}
