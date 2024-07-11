function loginTwitter() {
  console.log('Logging in with Twitter');
  google.script.run.authorizeService('Twitter');
}

function loginFacebook() {
  console.log('Logging in with Facebook');
  google.script.run.authorizeService('Facebook');
}

function fetchData() {
  var keyword = document.getElementById('keyword').value;
  if (keyword) {
    console.log('Fetching data for keyword:', keyword);
    google.script.run.withSuccess