function myFunction() {
  // Add the OAuth2 library
var OAuth2 = OAuth2 || {};  // Work around issue in Apps Script.

// Function to handle GET requests
function doGet(e) {
  return HtmlService.createHtmlOutputFromUrl('https://listensocial.github.io/index.html');
}

// OAuth2 callback function
function authCallback(request) {
  var service = OAuth2.getService(request.parameter.serviceName);
  var authorized = service.handleCallback(request);
  var url = authorized ? 'https://listensocial.github.io/authCallback.html' : 'https://listensocial.github.io/denied.html';
  return HtmlService.createHtmlOutputFromUrl(url).setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

// Function to fetch social media data
function fetchSocialMediaData(keyword) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('SocialMediaData');

  // Fetch Twitter data
  var tweets = getTweets(keyword);
  tweets.forEach(function(tweet) {
    sheet.appendRow(['Twitter', tweet.username, tweet.text, new Date(tweet.created_at)]);
  });

  // Fetch Facebook data
  var facebookPosts = getFacebookPosts(keyword);
  facebookPosts.forEach(function(post) {
    sheet.appendRow(['Facebook', post.from.name, post.message, new Date(post.created_time)]);
  });
}

// Function to get tweets using Access Token and Secret
function getTweets(keyword) {
  var service = getTwitterService();
  if (service.hasAccess()) {
    var url = 'https://api.twitter.com/2/tweets/search/recent?query=' + encodeURIComponent(keyword);
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'AAAAAAAAAAAAAAAAAAAAAPgluwEAAAAA2nmDWOB%2FtAct9BSSflNvJRLqoK4%3DpkuWu7HallezxHOBLoJvhPhstZ5wuEyKVx5yAT8iSzYZJeqKdm'
      }
    });
    var json = response.getContentText();
    var data = JSON.parse(json);
    return data.data.map(function(tweet) {
      return {
        username: tweet.username,
        text: tweet.text,
        created_at: tweet.created_at
      };
    });
  } else {
    Logger.log('Twitter login required');
    return [];
  }
}

// Function to get Facebook posts
function getFacebookPosts(keyword) {
  var service = getFacebookService();
  if (service.hasAccess()) {
    var url = 'https://graph.facebook.com/v10.0/me/feed?q=' + encodeURIComponent(keyword) + '&access_token=' + service.getAccessToken();
    var response = UrlFetchApp.fetch(url);
    var json = response.getContentText();
    var data = JSON.parse(json);
    return data.data.map(function(post) {
      return {
        from: {
          name: post.from.name
        },
        message: post.message,
        created_time: post.created_time
      };
    });
  } else {
    Logger.log('Facebook login required');
    return [];
  }
}

// Function to get Twitter OAuth2 service
function getTwitterService() {
  return OAuth2.createService('Twitter')
    .setAuthorizationBaseUrl('https://api.twitter.com/oauth/authorize')
    .setTokenUrl('https://api.twitter.com/oauth/access_token')
    .setClientId(PropertiesService.getScriptProperties().getProperty('dFdvSDJsb19DY3JnUlpWM3NIOGE6MTpjaQ'))
    .setClientSecret(PropertiesService.getScriptProperties().getProperty('PFF9B-yLYqKNqm_TVvLXXLLD1jf6rV9paQ7D0ubvwB2zK1nMwJ'))
    .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
    .setAccessToken(PropertiesService.getScriptProperties().getProperty('1557655303864197120-z84NvtdLUyW6CruKB07Tn9mOmCaDrv'))
    .setAccessTokenSecret(PropertiesService.getScriptProperties().getProperty('P7mXnXDXVLTjGldMoRwD1R4TTbCbGDkjcKQVC9LDE2BAg'))
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('read')
    .setTokenHeaders({
      Authorization: 'Basic ' + Utilities.base64Encode(PropertiesService.getScriptProperties().getProperty('TWITTER_API_KEY') + ':' + PropertiesService.getScriptProperties().getProperty('TWITTER_API_SECRET_KEY'))
    });
}

// Function to get Facebook OAuth2 service
function getFacebookService() {
  return OAuth2.createService('Facebook')
    .setAuthorizationBaseUrl('https://www.facebook.com/dialog/oauth')
    .setTokenUrl('https://graph.facebook.com/v10.0/oauth/access_token')
    .setClientId(PropertiesService.getScriptProperties().getProperty('1018905766460699'))
    .setClientSecret(PropertiesService.getScriptProperties().getProperty('7c34ceb4a1e16307af3e4f838f018211'))
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
    .setScope('public_profile,email');
}

// Function to authorize service
function authorizeService(serviceName) {
  var service = (serviceName === 'Twitter') ? getTwitterService() : getFacebookService();
  var authorizationUrl = service.getAuthorizationUrl();
  var template = HtmlService.createTemplate('<a href="<?= authorizationUrl ?>" target="_blank">Log in with <?= serviceName ?></a>');
  template.authorizationUrl = authorizationUrl;
  template.serviceName = serviceName;
  SpreadsheetApp.getUi().showModalDialog(template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME), 'Login Required');
}

// Function to set up script properties (run once to store credentials securely)
function setupProperties() {
  PropertiesService.getScriptProperties().setProperties({
    'TWITTER_API_KEY': 'dFdvSDJsb19DY3JnUlpWM3NIOGE6MTpjaQ',
    'TWITTER_API_SECRET_KEY': 'PFF9B-yLYqKNqm_TVvLXXLLD1jf6rV9paQ7D0ubvwB2zK1nMwJ',
    'TWITTER_ACCESS_TOKEN': '1557655303864197120-z84NvtdLUyW6CruKB07Tn9mOmCaDrv',
    'TWITTER_ACCESS_TOKEN_SECRET': 'P7mXnXDXVLTjGldMoRwD1R4TTbCbGDkjcKQVC9LDE2BAg',
    'FACEBOOK_APP_ID': '1018905766460699',
    'FACEBOOK_APP_SECRET': '7c34ceb4a1e16307af3e4f838f018211'
  });
}
}
