class HttpError extends Error{
  constructor(message,errorCode){
    super(message) //calling super for the meessage property
    this.code = errorCode
  }
}

module.exports = HttpError