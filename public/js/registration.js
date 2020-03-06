const Demo = {
  Elements : {},
  Actions  : {},
  errors: {}
};

Demo.initialize = function(){
  Demo.Elements.$form   = $('[js-form]');
  Demo.Elements.$submit = $('[js-submit]');

  Demo.Elements.$submit.click(Demo.Actions.register);
  Demo.Elements.$form.submit(Demo.Actions.register);

  CymaticXid.init({ registration : 'registration' });
};

Demo.Actions.register = function(event){
  event.preventDefault();

  let valid = true;
  let data  = {};

  Demo.Actions.resetFrom();

  Demo.Elements.$form.find('input').each(function(index, input){
    data[input.name] = input.value;
  });

  data.role = $('[js-role] option:selected').val();

  // validate form
  if(data.email !== data.confirm_email){
    Demo.Elements.$form.find('div[js-error="confirm_email"]').text('Emails must be equals');
    valid = false;
  }

  if(data.password !== data.confirm_password){
    Demo.Elements.$form.find('div[js-error="confirm_password"]').text('Passwords must be equals');
    valid = false;
  }

  if (!valid){ return false; }

  data.jwt = localStorage.getItem('cy/jwt');

  let request = $.ajax({
    method : 'POST'     ,
    url    : '/register',
    data   : data
  });

  request.done(Demo.Actions.redirect);
  request.fail(Demo.Actions.onError);
};

Demo.Actions.redirect = function(){
  return window.location.href = '/app';
};

Demo.Actions.resetFrom = function(){
  $('[js-error]').each(function (){
    $(this).text('');
  });
};

Demo.Actions.onError = function(response){
  try {
   let errors = response.responseJSON.errors;
   if (errors) {
     for (let prop in errors) {
       Demo.Elements.$form.find('div[js-error="' + prop + '"' + ']').text(errors[prop].message);
     }
   }
  } catch (err) {
    console.error(err);
  }
};

$(Demo.initialize);
