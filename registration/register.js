document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("registerButton").addEventListener("click", tryGetUser);
    document.getElementById("backToLogin").addEventListener("click", function() {
        window.location.href = '../index.html';
    });
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

function tryGetUser(username, password) {
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
      } else {
        registerUser();
      }
    })
    .then(data => {
            console.log('User exist', data);
            showMessage('Toks vartotojas jau egzistuoja!');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function registerUser() {
    const name = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const username = name.toLowerCase(); 

    const userData = {
        userName: username,
        password: password,
        email: email
    };

    fetch('https://localhost:7171/api/Auth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed with status: ' + response.status);
        }
    })
    .then(() => {
        console.log('User registered successfully:', userData);
        sessionStorage.setItem('userId', JSON.stringify(userData.id));
        sessionStorage.setItem('userName', JSON.stringify(userData.userName));
        sessionStorage.setItem('email', JSON.stringify(userData.email));
        window.location.href = '../toDoApp/toDoApp.html';
    })
    .catch(error => {
        console.error('Error:', error);
    });
}