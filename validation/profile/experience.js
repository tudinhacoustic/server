const Validator = require('validator')
const isEmpty = require('../is-empty')

module.exports = function validateExperienceInput(data){
  let errors = {};
  data.company = !isEmpty(data.company) ? data.company : '';
  data.location = !isEmpty(data.location) ? data.location : '';
  data.from = !isEmpty(data.from) ? data.from : '';


  if(Validator.isEmpty(data.from)){
    errors.message = 'From field is required';
  }
  if(Validator.isEmpty(data.location)){
    errors.message = 'Location field is required';
  }
  if(Validator.isEmpty(data.company)){
    errors.message = 'Company field is required';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  }
}
