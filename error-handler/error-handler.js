exports.invalidRoute = (req, res, next) => {
  
  res.status(404).send({ msg: "invalid route" });
};
exports.handleCustomErrors = (err, req, res, next) => {
  
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};
exports.psqlErrors = (err, req, res, next) => {
  
  const psqlCodes = ["22P02", "23502", "42703"];
  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ msg: err.message || "Bad Request" });
  } else if ((err.code = "23503")) {
    res.status(404).send({ msg: err.message });
  } else if ((err.code = "42703")) {
    
    res.status(404).send({ msg: err.message });
  }
  {
    next(err);
  }
};

exports.handle405Errors = (req, res, next) => {
  
  res.status(405).send({ msg: "Method denied." });
};
