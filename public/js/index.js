const Demo = {
  Elements : {},
  Actions  : {}
};

Demo.initialize = function(){
  Demo.Elements.$form     = $('[js-form]');
  Demo.Elements.$submit   = $('[js-submit]');
  Demo.Elements.$username = Demo.Elements.$form.find('[js-username]');
  Demo.Elements.$password = Demo.Elements.$form.find('[js-password]')
  Demo.Elements.$error    = Demo.Elements.$form.find('[js-error]')

  Demo.Elements.$username.on('keyup', Demo.Actions.submit);
  Demo.Elements.$password.on('keyup', Demo.Actions.submit);

  Demo.Elements.$submit.click(Demo.Actions.login);
  Demo.Elements.$form.submit(function(event){
    event.preventDefault();
  });

  CymaticXid.init({ login : 'login' }, function(error){
    if(error){ console.error(error); }
    Demo.Elements.$submit.prop('disabled', false);
    Demo.Elements.$username.prop('disabled', false);
    Demo.Elements.$password.prop('disabled', false);
  });
};

Demo.Actions.submit = function(event){
  event.preventDefault();
};

Demo.Actions.login = function(event){
  event.preventDefault();

  let credentials = {
    username : Demo.Elements.$username.val(),
    password : Demo.Elements.$password.val()
  };

  if(!credentials.username || !credentials.password){ return false; }

  credentials.jwt = localStorage.getItem('cy/jwt');

  setTimeout(function(){
    let request = $.ajax({
      method : 'POST'   ,
      url    : '/login' ,
      data   : credentials
    });

    request.done(Demo.Actions.redirect);
    request.fail(Demo.Actions.onError);
  }, 1000);
};

Demo.Actions.redirect = function(){
  return window.location.href = '/app';
};

Demo.Actions.onError = function(error){
  try{
    if(error.responseJSON.error.url){ return window.location.assign(error.responseJSON.error.url); }
    error.responseJSON.error =  typeof error.responseJSON.error === 'object' ? JSON.stringify(error.responseJSON.error, null, 2) : error.responseJSON.error;
    Demo.Elements.$error.removeClass('d-none');
    Demo.Elements.$error.html('<p>' + error.responseJSON.error + '</p>');
    Demo.Elements.$username.val('');
    Demo.Elements.$password.val('');
    Demo.Elements.$submit.prop('disabled', false);
    Demo.Elements.$username.focus();
  }catch(err){
    console.log(error);
  }
};

$(Demo.initialize);
