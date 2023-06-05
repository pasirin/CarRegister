const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");
const data = JSON.parse(localStorage.user);

window.onload = function () {
    document.querySelector(".name").innerHTML = data.username;
    document.querySelector(".profession").innerHTML = highestRole();
}

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
})

modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        modeText.innerText = "Light mode";
    } else {
        modeText.innerText = "Dark mode";

    }
});

function logout() {
    localStorage.removeItem("user");
    window.location.replace("../?logout")
}

function ADMIN() {
    document.querySelector('li.nav-link:last-child').classList.toggle('hidden')
}

function highestRole() {
    const list = data.roles;
    for (let i = 0; i < list.length; i++) {
        if (list[i] == "ROLE_ADMIN") {
            ADMIN();
            return "ADMIN";
        } else if (list[i] == "ROLE_MODERATOR") {
            return "Kiểm Duyệt Viên";
        }
    }
    return "Đăng Ký Viên";
}