exports.handleCustomErrors = (err, req, res, next) => {
  
  if (err.status) {
    
    res.status(err.status).send({msg: err.msg})
  }
  else 
  {next(err)};
};
exports.psqlErrors = (err, req, res, next) => {
  
  const psqlCodes = ['22P02', '23502','23503','42703','']
  if (psqlCodes.includes(err.code))
  
   { 
     
    
    res.status(400).send({ msg: err.message || 'Bad Request' })}
    else {next(err)}
  
}
exports.handle405Errors = (req,res,next) => {
  
  res.status(405).send({msg: "invalid method"})
}

exports.invalidRoute = (req,res,next) => {
  res.status(404).send({msg:"invalid route"})
}



