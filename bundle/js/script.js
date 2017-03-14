window.onload = function() {

  //*** Configuration section starts. ***
  var clientId = '99xuwzg5428j9y87bwp2lcl3qd8i6y';    //Enter your own clientId here.
  //*** Configuration section ends - do not modify any code below.

  //****************************************************************************
  // Twitch Specific Details.

  var baseUrl = 'https://api.twitch.tv/kraken';
  var endPoint = '/search/channels';
  var statusBarVisible = true;

  const pageSize = 10;     //X results per page.
  var pageNo = 1;           //Current page number.
  var pageCount = 0;        //Default.
  var query = "";           //Query term.

  //searchTwitch(): search Twitch by providing a query & callback function.
  var searchTwitch = function (query, pageNo, callbackFn) {
    var url = baseUrl + endPoint + '?client_id=' + clientId + '&query=' + query;

    if (pageNo > 1) {
      url += '&limit=50&offset=' + ((pageNo - 1) * pageSize);
    } else {
      url += '&limit=50';
    }

    return getData(url, callbackFn);
  };


  //removePrevEntries(): in v2, we could opt to reuse these components instead of removing & reinserting them later.
  var removePrevEntries = function () {
    var canvasElem = document.getElementById('content');
    var items = document.getElementsByClassName('channel-entry');

    if (items.length) {
      for(var i=items.length - 1; i >= 0; i--) {    //backwards removal.
        canvasElem.removeChild(items[i]);
      }
    }
  }


  //createEntries(): speeds up populating of the entries (project specific).
  var createEntries = function (channels) {
    if (channels.length) {
      removePrevEntries();

      for(var i=0; i<channels.length; i++) {
        var canvasElem = document.getElementById('content');

        var htmlContent = '<a class="channel-entry-link" target="_blank" href="http://twitch.com/' + channels[i].display_name + '">'
                        + '<img src="' + channels[i].logo + '" alt="Sorry no logo">'
                        + '<div class="channel-entry__info">'
                        + '<div class="channel-entry__stream-name">' + channels[i].display_name + '</div>'
                        + '<div class="channel-entry__game">' + channels[i].game + ' - ' + channels[i].views + ' viewers</div>'
                        + '<div class="channel-entry__description">' + channels[i].status + '</div>'
                        + '</div>'
                        + '</a>';

        appendHtmlContent('content', htmlContent, channels[i]._id, 'channel-entry');
      }
    }
  };


  //hideStatusBar(): hide initial 'looking for content? ...' status bar.
  var hideStatusBar = function () {
    if (statusBarVisible)
      document.getElementsByClassName('status')[0].style.display = 'none';
  };


  //updateHeader(): updates header & nav info.
  var updateHeader = function(data) {
    pageCount = Math.ceil(data['total_results'] / pageSize);
    pageNo = data['page_no'];
    document.getElementById('result-count').innerHTML = data['total_results'];
    document.getElementById('page-no').innerHTML = pageNo + ' / ' + pageCount;
  };


  //runSearch(): runs search & performs the updates.
  var runSearch = function(q, pNo) {
    if (q.length) {
      hideStatusBar();

      searchTwitch(q, pNo, function(data) {
        createEntries(data['channels']);
        updateHeader({
          'total_results': data['_total'],
          'page_no': pNo
        });
      });
    }
  }


  //setupSearchButton(): prepares SearchButton handler.
  var setupSearchButton = function() {
    document.getElementById('searchButton').addEventListener('click', function() {
      query = document.getElementById('searchBox').value;     //Updates parent query var.
      runSearch(query, pageNo);
    });

  };


  //setupNav(): sets up navigation buttons via event bubbling on summary-container.
  var setupNav = function() {
    document.getElementsByClassName('summary-container')[0].addEventListener('click', function(e) {
      if ((e.target.id == "nav-prev") && (pageNo - 1 > 0)) {
          runSearch(query, pageNo - 1);       //Prev Page.
      } else if ((e.target.id == "nav-next") && (pageNo + 1 <= pageCount)) {
          runSearch(query, pageNo + 1);       //Next Page.
      }
    });
  };


  //Startup.
  (function() {
    setupSearchButton();
    setupNav();
  })();

}
