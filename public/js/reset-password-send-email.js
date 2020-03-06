const Demo = {
  Elements : {},
  Actions  : {}
};

Demo.initialize = function(){
  Demo.Elements.$form  = $('[js-form]');
  Demo.Elements.$email = Demo.Elements.$form.find('[js-email]');
  Demo.Elements.$error = Demo.Elements.$form.find('[js-error]');

  Demo.Elements.$form.submit(Demo.Actions.submit);

  CymaticXid.init();
};

Demo.Actions.submit = function(event){
  event.preventDefault();

  let email = Demo.Elements.$email.val();

  let request = $.ajax({
    method : 'POST'   ,
    url    : '/reset_password',
    data   : { email: email }
  });

  request.done(Demo.Actions.redirect);
  request.fail(Demo.Actions.onError);
};

Demo.Actions.redirect = function(data){
  return window.location.assign(data.url);
};

Demo.Actions.onError = function(error){
  Demo.Elements.$error.html('<p>' + error.responseText + '</p>');
};

$(Demo.initialize);
