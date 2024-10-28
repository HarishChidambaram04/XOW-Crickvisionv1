function showPass(elemx) {
    const eyel = document.getElementsByName('ixx');
    eyel.forEach((el) => {
        if (el.classList.contains('fa-eye-slash')) {
            el.classList.add('fa-eye');
            el.classList.remove('fa-eye-slash');
        } else {
            el.classList.remove('fa-eye');
            el.classList.add('fa-eye-slash');
        }
    })
    const inputElement = document.getElementsByName(elemx);
    inputElement.forEach((elx) => {
        if (elx.type == "password") {
            elx.type = "text";
        } else {
            elx.type = "password";
        }
    })
}