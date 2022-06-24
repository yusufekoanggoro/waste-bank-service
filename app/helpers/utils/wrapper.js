const response = (res, type, result, message = '', code = 200) => {
    let status = true;
    let data = result;
    if(type === 'fail'){
      status = false;
      data = '';
      message =  message;
      code = code
    }
    res.status(code).send({
        success: status,
        data,
        message,
        code
    });
};

const data = (data, description = '', code = 200) => ({ err: null, message: description, data, code });

const error = (err, description, code = 500) => ({ err, code, data: '', message: description });

module.exports = {
    response,
    data,
    error
}