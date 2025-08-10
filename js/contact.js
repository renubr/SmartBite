(function () {
    emailjs.init({
        publicKey: "MpHG863r3Si9GE0JS",
    });
})();

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('contact-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        // Collect form data
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let message = document.getElementById('message').value;

        // Define the template parameters
        let templateParams = {
            from_name: name,
            from_email: email,
            message: message
        };

        // Send the email using EmailJS
        emailjs.send('service_23bedfa', 'template_8l4oy7p', templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Thank you for contacting us!');
                // Reset the form
                document.getElementById('contact-form').reset();
            }, function (error) {
                console.log('FAILED...', error);
                alert('Sorry, there was an error sending your message. Please try again later.');
            });
    });
});