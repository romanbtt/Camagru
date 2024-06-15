function validateForm(reset, resetInput) {
    errorForm = document.getElementById('error-form');

    function resetStyles() {
        resetInput.style.border = '';
        errorForm.textContent = '‎';
    }

    if (!reset) {
        errorForm.textContent = 'Username or email is required.';
        resetInput.style.border = '1px solid red';
    }

    setTimeout(resetStyles, 3000);
}

function resetPassword(event) {
    event.preventDefault();

    var resetInput = document.getElementById('reset');
    var reset = resetInput.value;

    validateForm(reset, resetInput);
}