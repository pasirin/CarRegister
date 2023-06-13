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
    $('button.disable').toggleClass("disable").prop("disabled", false);
    $('input.disable').toggleClass("disable").prop("disabled", false);
    $('button[type="button"]#deleteAll').on("click", async function () {
        await fetch("/api/delete/vehicles", {
            method: "DELETE",
            headers: {
                "Authorization": data.tokenType + " " + data.accessToken,
            }
        }).then(response => {
            if (response.status == 200) {
                alert("Toàn bộ phương tiện đã được xóa khỏi hệ thống")
            } else {
                alert("Không đủ thẩm quyền để xóa dữ liệu")
                console.log(response)
            }
        })
        await new Promise(resolve => setTimeout(resolve, 500))
        await getData(data.tokenType + " " + data.accessToken, "update");
    })
    $('input[type="file"]#addmore').on("change", function () {
        var reader = new FileReader();
        reader.onload = function () {
            var arrayBuffer = this.result,
                array = new Uint8Array(arrayBuffer),
                binaryString = String.fromCharCode.apply(null, array);

            /* Call XLSX */
            var workbook = XLSX.read(binaryString, {
                type: "binary"
            });

            /* DO SOMETHING WITH workbook HERE */
            var first_sheet_name = workbook.SheetNames[0];
            /* Get worksheet */
            var worksheet = workbook.Sheets[first_sheet_name];
            changeData(XLSX.utils.sheet_to_json(worksheet, {
                raw: true
            }));
        }
        reader.readAsArrayBuffer(this.files[0]);
    })
    $('input[type="file"]#freshrestart').on("change", function () {
        var reader = new FileReader();
        reader.onload = function () {
            var arrayBuffer = this.result,
                array = new Uint8Array(arrayBuffer),
                binaryString = String.fromCharCode.apply(null, array);

            /* Call XLSX */
            var workbook = XLSX.read(binaryString, {
                type: "binary"
            });

            /* DO SOMETHING WITH workbook HERE */
            var first_sheet_name = workbook.SheetNames[0];
            /* Get worksheet */
            var worksheet = workbook.Sheets[first_sheet_name];
            changeData(XLSX.utils.sheet_to_json(worksheet, {
                raw: true
            }),"delete");
        }
        reader.readAsArrayBuffer(this.files[0]);
    })
}

async function changeData(list, method="add") {
    if(method=="delete") {
        await fetch("/api/delete/vehicles", {
            method: "DELETE",
            headers: {
                "Authorization": data.tokenType + " " + data.accessToken,
            }
        }).then(response => {
            if (response.status == 200) {
                alert("Toàn bộ phương tiện đã được xóa khỏi hệ thống")
            } else {
                alert("Không đủ thẩm quyền để xóa dữ liệu")
                console.log(response)
                return
            }
        })
        await new Promise(resolve => setTimeout(resolve, 500))
        await getData(data.tokenType + " " + data.accessToken, "update");
    }
    let payload = [];
    await list.forEach(element => {
        let temp = {};
        temp.plateNumber = element.plateNumber;
        temp.createdDate = element.createdDate;
        temp.newestDate = element.newestDate;
        temp.lastRegion = element.lastRegion;
        temp.ownerName = element.ownerName;
        temp.type = element.type;
        payload.push(temp);
    })
    await fetch("/api/add/vehicles", {
        method: "POST",
        headers: {
            "Authorization": data.tokenType + " " + data.accessToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    }).then(response => {
        alert("Đã hoàn tất thêm các phương tiện hợp lệ vào hệ thống")
    })
    await new Promise(resolve => setTimeout(resolve, 500))
    await getData(data.tokenType + " " + data.accessToken, "update");
}

function highestRole() {
    const list = data.roles;
    let output = "Đăng Ký Viên"
    for (let i = 0; i < list.length; i++) {
        if (list[i] == "ROLE_ADMIN") {
            ADMIN();
            return "ADMIN";
        } else if (list[i] == "ROLE_MODERATOR") {
            output = "Kiểm Duyệt Viên";
        }
    }
    return output;
}