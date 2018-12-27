const Validator = require('validator')
const isEmpty = require('../is-empty')

module.exports = function validateEducationInput(data){
  let errors = {};
  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';




  if(Validator.isEmpty(data.from)){
    errors.message = 'From field is required';
  }
  if(Validator.isEmpty(data.fieldofstudy)){
    errors.message = 'Fieldofstudy field is required';
  }
  if(Validator.isEmpty(data.degree)){
    errors.message = 'Degree field is required';
  }
  if(Validator.isEmpty(data.school)){
    errors.message = 'School field is required';
  }

  return{
    errors,
    isValid: isEmpty(errors)
  }
}
