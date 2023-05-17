const form = document.querySelector("form");
eField = form.querySelector(".email"),
    eInput = eField.querySelector("input"),
    pField = form.querySelector(".password"),
    pInput = pField.querySelector("input");
const wrongMes = document.getElementById("wrong");
let show = false;

const eyeIcon = document.querySelector('i.pass-icon')
const passInput = document.querySelector('input[id="password"]')
const submitButton = document.querySelector('input[type="submit"]')

const url = 'https://picsum.photos/' + window.screen.availWidth + '/' + window.screen.availHeight;
let element = document.querySelector('body');
let image = new Image();
image.onload = () => {
    element.style.setProperty('background-image', 'url(' + url + ')')
    let opacity = 0;
    let fadeIn = setInterval(() => {
        if (opacity >= 1) {
            clearInterval(fadeIn);
        }
        element.style.opacity = opacity;
        opacity += 0.02;
    }, 10);
}
image.src = url

function showPass() {
    show = !show;
    if (show) {
        passInput.type = "text";
        eyeIcon.classList.remove("fa-eye");
        eyeIcon.classList.add("fa-eye-slash");
    } else {
        passInput.type = "password";
        eyeIcon.classList.remove("fa-eye-slash");
        eyeIcon.classList.add("fa-eye")
    }
}


form.onsubmit = (e) => {
    e.preventDefault();

    (eInput.value == "") ? eField.classList.add("shake", "error") : checkEmail();
    if (pInput.value == "") {
        pField.classList.add("shake", "error");
        eyeIcon.classList.add("error");
    } else {
        checkPass();
    }

    setTimeout(() => {
        eField.classList.remove("shake");
        pField.classList.remove("shake");
    }, 500);

    eInput.onkeyup = () => { checkEmail(); wrongMes.hidden = true; }
    pInput.onkeyup = () => { checkPass(); wrongMes.hidden = true; }

    function checkEmail() {
        if (eInput.value == "") {
            eField.classList.add("error");
            eField.classList.remove("valid");
        } else {
            eField.classList.remove("error");
            eField.classList.add("valid");
        }
    }

    function checkPass() {
        if (pInput.value == "") {
            pField.classList.add("error");
            pField.classList.remove("valid");
            eyeIcon.classList.add("error");
        } else {
            pField.classList.remove("error");
            pField.classList.add("valid");
            eyeIcon.classList.remove("error");
        }
    }

    if (!eField.classList.contains("error") && !pField.classList.contains("error")) {
        submitButton.classList.add("disable");
        submitButton.value = "Loading...";
        submitButton.disabled = true;
        let body = {
            username: eInput.value,
            password: pInput.value,
        }
        fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }).then(response => response.json()).then(data => {
            submitButton.classList.remove("disable");
            submitButton.value = "Đăng nhập";
            submitButton.disabled = false;
            if (data.status == 401) {
                wrongMes.hidden = false
            } else {
                localStorage.setItem("user", data);
                window.location.replace(form.getAttribute("action"));
            }
        })
    }

}