const response = (res, type, result, message = '', code = 200, attachment) => {
    let status = true;
    let data = result;
    if(type === 'fail'){
      status = false;
      data = '';
      message =  message;
      code = code
    }
    if(attachment){
        return res.send(attachment);
    }else{
        res.status(code).send({
            success: status,
            data,
            message,
            code
        });
    }
};

const data = (data, description = '', code = 200) => ({ err: null, message: description, data, code });

const error = (err, description, code = 500) => ({ err, code, data: '', message: description });

const paginationResponse = (res, type, result, message = null, code = null, meta) => {
    let status;
    switch (type) {
    case 'fail':
      status = false;
      break;
    case 'success':
      status = true;
      break;
    default:
      status = false;
      break;
    }
    res.status(code).send(
      {
        success : status,
        data: result,
        meta,
        code,
        message
      }
    );
  };

module.exports = {
    response,
    data,
    error,
    paginationResponse
}