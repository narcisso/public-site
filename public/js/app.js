const Demo = {
  Elements : {},
  Actions  : {}
};

Demo.initialize = function(){
  Demo.Elements.$welcome         = $('[js-welcome]');
  Demo.Elements.$form            = $('[js-form]');
  Demo.Elements.$email           = $('[js-email]');
  Demo.Elements.$error           = $('[js-error]');
  Demo.Elements.$changePassword  = $('[js-change-password]');
  Demo.Elements.$confirmPassword = $('[js-confirm_password]');
  Demo.Elements.$logout          = $('[js-logout]');

  let request = $.ajax({
    method : 'POST',
    url    : '/me'
  });

  Demo.Elements.$changePassword.on('keyup', Demo.Actions.submit);
  Demo.Elements.$logout.on('click', Demo.Actions.logout);
  Demo.Elements.$form.submit(Demo.Actions.changePassword);

  request.done(Demo.Actions.updateData);
  request.fail(Demo.Actions.onError);


  CymaticXid.init();
};

Demo.Actions.submit = function(event){
  event.preventDefault();
};

Demo.Actions.logout = function(event){
  if(event && event.preventDefault){ event.preventDefault(); }

  let request = $.ajax({
    method : 'POST'   ,
    url    : '/logout',
    data   : {
      jwt : localStorage.getItem('cy/jwt')
    }
  });

  request.done(Demo.Actions.redirect);
  request.fail(Demo.Actions.onError);
};

Demo.Actions.updateData = function(user){
  if(Demo.Elements.$welcome){ Demo.Elements.$welcome.html(user.first_name); }
  if(Demo.Elements.$email){ Demo.Elements.$email.html(user.email); }
};

Demo.Actions.changePassword = function(event){
  if(event){ event.preventDefault(); }

  if(!Demo.Elements.$changePassword){ return Demo.Actions.onError('No password field found'); }

  let password = Demo.Elements.$changePassword.val();
  let confirm  = Demo.Elements.$confirmPassword.val();

  if(!password){ return Demo.Actions.onError('New password can not be empty'); }
  if(password != confirm){ return Demo.Actions.onError('Confirm password must match'); }

  let request = $.ajax({
    method : "POST",
    url : "/password",
    data : { password: password }
  });

  request.done(Demo.Actions.logout);
  request.fail(Demo.Actions.onError);
};

Demo.Actions.redirect = function(){
  return window.location.href = '/';
};

Demo.Actions.onError = function(error){
  console.log(error);
  if(Demo.Elements.$error){ Demo.Elements.$error.html(error); }
};

$(Demo.initialize);
