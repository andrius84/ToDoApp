document.getElementById("loginButton").addEventListener("click", loginUser);

document.getElementById("registerButton").addEventListener("click", function() {
  window.location.href = 'registration/register.html';
});

function showMessage(message) {
    let messageDiv = document.getElementById("message");
    if (!messageDiv) {
        messageDiv = document.createElement("div");
        messageDiv.id = "message";
        document.body.appendChild(messageDiv);
    }
    messageDiv.style.display = 'block';
    messageDiv.style.backgroundColor = 'red';
    messageDiv.style.color = 'white';
    messageDiv.style.padding = '5px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.textAlign = 'center';
    
    messageDiv.textContent = message;
  }

function loginUser() {
  const username = document.getElementById("username").value.toLowerCase();
  const password = document.getElementById("password").value;

  const url = `https://localhost:7171/api/Auth?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

  fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json' 
      }
  })
  .then(response => {
    if (response.ok) {
        return response.json();
    } else if (response.status === 404) {
        showMessage('Vartotojas nerastas, bandykite dar kartą.');
    } else {
        showMessage('Įvyko klaida. Bandykite dar kartą.');
    }
})
  .then(data => {
      if (data.userName === username) {
          console.log('Login successful:', data);

          sessionStorage.setItem('userId', JSON.stringify(data.id));
          sessionStorage.setItem('userName', JSON.stringify(data.userName));
          sessionStorage.setItem('email', JSON.stringify(data.email));

          window.location.href = 'toDoApp/toDoApp.html'; 
      } else {
          console.log('Login failed: ' + (data.message));
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}