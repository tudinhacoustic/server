const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data){
  let errors = {};
  data.firstname = !isEmpty(data.firstname) ? data.firstname : '';
  data.lastname = !isEmpty(data.lastname) ? data.lastname : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';
  data.birthday = !isEmpty(data.birthday) ? data.birthday : '';
  data.genge = !isEmpty(data.genge) ? data.genge : '';

  // if(!Validator.isLength(data.name, {min: 2, max: 30})){
  //   errors.name = 'Name must be between 2 and 30 characters';
  // }
  // if(Validator.isEmpty(data.name)){
  //   errors.name = 'Name field is required';
  // }
  if(Validator.isEmpty(data.genge)){
    errors.message = 'Genge is required'
  }
  if(Validator.isEmpty(data.birthday)){
    errors.message = 'Birthday is required'
  }
  if(!Validator.equals(data.password, data.password2)){
    errors.message = 'Confirm password must match';
  }
  if(Validator.isEmpty(data.password2)){
    errors.message = 'Confirm password field is required';
  }
  if(!Validator.isLength(data.password, {min: 6, max: 30})){
    errors.message = 'Password must be at least 6 characters';
  }
  if(Validator.isEmpty(data.password)){
    errors.message = 'Password field is required';
  }
  if(Validator.isEmpty(data.email)){
    errors.message = 'Email field is required';
  }
  if(!Validator.isEmail(data.email)){
    errors.message = 'Email is invalid';
  }
  if(Validator.isEmpty(data.lastname)){
    errors.message = 'Lastname is required'
  }
  if(Validator.isEmpty(data.firstname)){
    errors.message = 'Firstname is required'
  }
  return{
    errors,
    isValid: isEmpty(errors)
  }
}
