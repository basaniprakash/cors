const authButton = document.getElementById('authButton');

authButton.addEventListener('click', () => {
    // Simply redirect to the Google authentication URL
    window.location.href = 'https://www.corsauth.com/auth/google';
});


