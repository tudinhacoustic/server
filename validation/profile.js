const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateProfileInput(data){
  let errors = {};

   data.handle = !isEmpty(data.handle) ? data.handle : '';
   data.backgroundimage = !isEmpty(data.backgroundimage) ? data.backgroundimage : '';
   data.categories = !isEmpty(data.categories) ? data.categories : '';
  // data.status = !isEmpty(data.status) ? data.status : '';
  // data.skills = !isEmpty(data.skills) ? data.skills : '';

  if(Validator.isEmpty(data.categories)){
    errors.message = 'Categories is required'
  }
  if(Validator.isEmpty(data.backgroundimage)){
    errors.message = 'Backgroundimage is required'
  }

  if(!Validator.isLength(data.handle, {min: 2, max: 40})){
    errors.message = 'Handle needs to between 2 and 40 characters';
  }
  if(Validator.isEmpty(data.handle)){
    errors.message = 'Handle is required'
  }
  return {
    errors,
    isValid: isEmpty(errors)
  }


}
