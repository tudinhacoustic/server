const Validator = require('validator')
const isEmpty = require('../is-empty')

module.exports = function validateAboutInput(data){
  let errors = {};
  data.description = !isEmpty(data.description) ? data.description : '';
  data.address = !isEmpty(data.address) ? data.address : '';
  data.phonenumber = !isEmpty(data.phonenumber) ? data.phonenumber : '';
  //data.website = !isEmpty(data.website) ? data.website : '';
  data.job = !isEmpty(data.job) ? data.job : '';





  if(Validator.isEmpty(data.job)){
    errors.message = 'Job field is required';
  }
  // if(Validator.isEmpty(data.website)){
  //   errors.message = 'Website field is required';
  // }
  if(Validator.isEmpty(data.phonenumber)){
    errors.message = 'Phonenumber field is required';
  }
  if(Validator.isEmpty(data.address)){
    errors.message = 'Address field is required';
  }
  if(Validator.isEmpty(data.description)){
    errors.message = 'Description field is required';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  }
}
