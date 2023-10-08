const authButton = document.getElementById('authButton');

authButton.addEventListener('click', () => {
    // Fetch the redirect URL from the auth service
    fetch('https://www.corsauth.com/start-auth', {
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        // Check if the redirect URL is present in the response
        if (data.redirectURL) {
            // Navigate to the redirect URL
            window.location.href = data.redirectURL;
        } else {
            console.error('Redirect URL missing in the response.');
        }
    })
    .catch(error => {
        console.error('Failed to start auth:', error);
    });
});

