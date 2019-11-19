exports.handle405Errors = (req,res,next) => {
  console.log("ive reached the error handler")
  res.status(405).send({msg: "invalid method"})
}

exports.invalidRoute = (req,res,next) => {
  res.status(404).send({msg:"invalid route"})
}

exports.psqlErrors = (err, req, res, next) => {
  
  const psqlCodes = ['22P02']
  if (psqlCodes.includes(err.code))
  
    res.status(400).send({ msg: err.message || 'Bad Request' });
  res.status(500).send({ msg: 'Internal Server Error' });
}



exports.handleCustomErrors = (err, req, res, next) => {
  
  if (err.status) {
    
    res.status(err.status).send({msg: err.msg})
  }
  else 
  {next(err)};
};