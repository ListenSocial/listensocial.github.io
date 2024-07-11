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
    google.script.run.withSuccessHandler(onSuccess).withFailureHandler(onFailure).fetchSocialMediaData(keyword);
  } else {
    alert('Please enter a keyword.');
  }
}

function onSuccess() {
  document.getElementById('success-message').style.display = 'block';
  document.getElementById('error-message').style.display = 'none';
}

function onFailure() {
  document.getElementById('success-message').style.display = 'none';
  document.getElementById('error-message').style.display = 'block';
}