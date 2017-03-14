//****************************************************************************
// Portable functions to speed up dev.

//getData(): retrieve jsonp content.
var getData = function (url, callback) {
  var callbackFn = 'callback_' + Math.round(999999 * Math.random());

  window[callbackFn] = function(data) {
    delete window[callbackFn];
    document.body.removeChild(script);
    callback(data);
  }

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackFn;
  document.body.appendChild(script);
};


//appendHtmlContent(): speeds up html element additions.
var appendHtmlContent = function (targetId, htmlContent, id, elemClass) {
  let div = document.createElement('div');
  div.innerHTML = htmlContent;
  div.id = id;
  div.className = elemClass;

  if (div.children.length > 0) {
    document.getElementById(targetId).appendChild(div);
  }
};
