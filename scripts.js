async function startListening() {
  const keywords = document.getElementById("keywords").value;
  const platforms = Array.from(document.querySelectorAll('input[name="platform"]:checked')).map(el => el.value);
  const response = await fetch('https://listensocial.github.io.index.html', { // Replace with your actual URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ keywords, platforms }),
  });
  const data = await response.json();
  // Update UI with the received data
}
