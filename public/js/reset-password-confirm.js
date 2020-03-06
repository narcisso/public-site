const Demo = {
  Elements : {},
  Actions  : {}
};

Demo.initialize = function(){
  Demo.Elements.$form            = $('[js-form]');
  Demo.Elements.$password        = Demo.Elements.$form.find('[js-password]');
  Demo.Elements.$confirmPassword = Demo.Elements.$form.find('[js-confirm-password]');
  Demo.Elements.$error           = Demo.Elements.$form.find('[js-error]');

  Demo.Elements.$form.submit(Demo.Actions.changePassword);

  CymaticXid.init();
};

Demo.Actions.changePassword = function(event){
  if(event){ event.preventDefault(); }

  let password = Demo.Elements.$password.val();
  let confirm  = Demo.Elements.$confirmPassword.val();

  if(!password){ return Demo.Actions.onError('New password can not be empty'); }
  if(password != confirm){ return Demo.Actions.onError('Confirm password must match'); }

  let request = $.ajax({
    method : "POST",
    url : '/change_password' + location.search,
    data : { password: password }
  });

  request.done(Demo.Actions.redirect);
  request.fail(Demo.Actions.onError);
};

Demo.Actions.redirect = function(data){
  return window.location.assign('/');
};

Demo.Actions.onError = function(error){
  Demo.Elements.$error.html('<p>' + error + '</p>');
};

$(Demo.initialize);
