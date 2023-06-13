if (localStorage.getItem("user") == null) {
    window.location.replace("../")
} else {
    getData(data.tokenType + " " + data.accessToken);
}
let showPass = false;
let eyeIcon = document.querySelector('.bx-hide');

function togglePass() {
    showPass = !showPass
    if (showPass) {
        $('#password').attr("type", "text");
        eyeIcon.classList.remove("bx-hide");
        eyeIcon.classList.add("bx-show");
    } else {
        $('#password').attr("type", "password");
        eyeIcon.classList.remove("bx-show");
        eyeIcon.classList.add("bx-hide");
    }
}

const dashboard = document.getElementById('Dashboard');
let currentDisplay = dashboard;

$('form.add-Vehicle').submit(async function (e) {
    e.preventDefault();
    let ownername = $('#ownername').val();
    let region = $('#region').val();
    let Type = $('#type').val();
    let platenumber = $('#platenumber').val();
    let createddate = $('#createdDate').val();
    let newestdate = $('#newestDate').val();
    let body = {
        plateNumber: platenumber,
        createdDate: createddate,
        lastRegion: region,
        ownerName: ownername,
        type: Type,
    }
    if (newestdate != "") {
        body.newestDate = newestdate;
    }
    fetch('/api/add/vehicle', {
        method: 'POST',
        headers: {
            "Authorization": data.tokenType + " " + data.accessToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(response => {
        if (response.status == 200) {
            alert("Phương tiện đã được thêm vào hệ thống")
        } else {
            alert("Thêm phương tiện thất bại vì đã có phương tiện có trùng biển số")
        }
    })
    await new Promise(resolve => setTimeout(resolve, 500))
    await getData(data.tokenType + " " + data.accessToken, "update");
})

$('form.add-Account').submit(async function (e) {
    e.preventDefault();
    let userName = $('#username').val();
    let userEmail = $('#email').val();
    let userPassword = $('#password').val();
    let userRegion = $('#Userregion').val();
    let userRole = $('#role').val();
    switch (userRole) {
        case 'mod':
            userRole = ['user', 'mod']
            break;
        case 'admin':
            userRole = ['user', 'mod', 'admin']
            break;
        default:
            userRole = ['user']
            break
    }
    let body = {
        username: userName,
        email: userEmail,
        password: userPassword,
        role: userRole,
        region: userRegion,
    }
    fetch('/api/auth/signup', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(response => {
        if (response.status == 200) {
            alert("Người dùng đã được thêm vào hệ thống");
        } else {
            alert("Thêm người dùng thất bại vì đã có tài khoản trùng tên");
        }
    })
    await new Promise(resolve => setTimeout(resolve, 500));
    await getAccList(data.tokenType + " " + data.accessToken);
})

async function getData(key, option = "new") {
    await fetch("/api/get/vehicle", {
        method: "GET",
        headers: {
            "Authorization": key
        }
    }).then(function (response) {
        response.json().then(function (text) {
            let vehicleList = text;
            // Private Data variables to count
            let countGood = 0,
                countWarning = 0,
                countBad = 0;
            let badWaringVehicles = [];
            let newVehicles = [];
            let countNewVehicles = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (let i = 0; i < text.length; i++) {
                // Actual Date To Compare
                let nextCycle = moment(text[i].nextCycle, "YYYY-MM-DD").toDate();
                let firstCycle = moment(text[i].createdDate, "YYYY-MM-DD").toDate();
                let newestCycle = moment(text[i].newestDate, "YYYY-MM-DD").toDate();
                let today = new Date();
                let nextMonth = new Date(today.setMonth(today.getMonth() + 1));
                // Count the new Vehicles in the year
                if (today.getFullYear() == firstCycle.getFullYear() || today.getFullYear() == newestCycle.getFullYear()) {
                    countNewVehicles[newestCycle.getMonth()]++;
                }
                // Count the good, bad, and warning vehicles
                if ((today.getFullYear() == firstCycle.getFullYear() && today.getMonth() == firstCycle.getMonth() + 1) ||
                    (today.getFullYear() == newestCycle.getFullYear() && today.getMonth() == newestCycle.getMonth() + 1)) {
                    newVehicles.push(text[i]);
                    countGood++;
                    text[i].checked = "Còn Hạn";
                } else if (nextCycle < nextMonth) {
                    countWarning++;
                    text[i].checked = "Sắp Hết Hạn";
                    badWaringVehicles.push(text[i]);
                } else if (nextCycle < today) {
                    countBad++;
                    text[i].checked = "Quá Hạn";
                    badWaringVehicles.push(text[i]);
                } else {
                    countGood++;
                    text[i].checked = "Còn Hạn";
                }
                text[i].lastRegion = convertRegion(text[i].lastRegion.name)
            }
            initChart(countGood, countWarning, countBad, countNewVehicles);
            if (option == "new") {
                initTables(vehicleList, badWaringVehicles, newVehicles);
            } else if (option == "update") {
                updateTables(vehicleList, badWaringVehicles, newVehicles);
            }
        })
    })
}

function updateTables(entireList, notOkList, newThisMonthList) {
    let searchTable = $('#SearchAll').DataTable();
    let dashboardTable1 = $('#ThisMonthNew').DataTable();
    let dashboardTable2 = $('#PredictThisMonth').DataTable();
    searchTable.clear();
    dashboardTable1.clear();
    dashboardTable2.clear();
    searchTable.rows.add(entireList);
    dashboardTable1.rows.add(newThisMonthList);
    dashboardTable2.rows.add(notOkList);
    searchTable.draw();
    dashboardTable1.draw();
    dashboardTable2.draw();
}

function initChart(good, warning, bad, countNew) {
    let pieLabel = ["Còn Hạn", "Sắp Hết Hạn", "Quá Hạn"];
    let pieValue = [good, warning, bad];
    let pieColors = ["#00FF00", "#FFFF00", "#FF0000"];
    new Chart("ChartPredict", {
        type: "pie",
        data: {
            labels: pieLabel,
            datasets: [{
                backgroundColor: pieColors,
                data: pieValue
            }]
        },
        options: {
            title: {
                display: true,
                text: "Tình trạng đăng kiểm của toàn bộ các xe trong tháng này"
            }
        }
    }).update();
    let barChartLabel = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
    let barChartValues = countNew;
    new Chart("ChartThisYear", {
        type: "bar",
        data: {
            labels: barChartLabel,
            datasets: [{
                backgroundColor: "lightblue",
                data: barChartValues
            }]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: "Số lượng các xe đã đăng kiểm trong năm nay"
            }
        }
    }).update();
}

function initTables(entireList, notOkList, newThisMonthList) {
    let tableLabels = [
        { title: 'Biển số', data: "plateNumber", className: "dt-center small" },
        { title: 'Người đứng tên', data: "ownerName", className: "dt-center small" },
        { title: 'Điểm đăng kiểm', data: "lastRegion", className: "dt-center small" },
        { title: 'Ngày sẳn xuất', data: "createdDate", className: "dt-center small" },
        { title: 'Lần đăng kiểm cuối', data: "newestDate", className: "dt-center small" },
        { title: 'Hạn đăng kiểm tiếp', data: "nextCycle", className: "dt-center small" },
        { title: 'Tình trạng đăng kiểm', data: "checked", className: "dt-center small" }
    ]
    let bigTableLabels = [
        { title: 'ID', data: "id", className: "dt-center" },
        { title: 'Biển số', data: "plateNumber", className: "dt-center" },
        { title: 'Người đứng tên', data: "ownerName", className: "dt-center" },
        { title: 'Điểm đăng kiểm', data: "lastRegion", className: "dt-center" },
        { title: 'Ngày sẳn xuất', data: "createdDate", className: "dt-center" },
        { title: 'Lần đăng kiểm cuối', data: "newestDate", className: "dt-center" },
        { title: 'Hạn đăng kiểm tiếp', data: "nextCycle", className: "dt-center" },
        { title: 'Tình trạng đăng kiểm', data: "checked", className: "dt-center" },
        { title: 'Hành động', data: null, className: "dt-center", defaultContent: "<i class='bx bxs-trash bx-sm actionable'></i><i class='bx bx-check-square bx-sm actionable'></i>" }
    ]
    let mainTable = $('#SearchAll').DataTable({
        data: entireList,
        columns: bigTableLabels,
        createdRow: function (row, data, index) {
            if (data.checked == "Còn Hạn") {
                $(row).find('.bx-check-square').addClass('disable');
                $(row).addClass('safeData');
            } else if (data.checked == "Sắp Hết Hạn") {
                $(row).addClass('warningData');
            } else {
                $(row).addClass('badData');
            }
        },
        info: false,
        lengthChange: false,
        language: {
            emptyTable: "Không có phương tiện nào",
            paginate: {
                first: "Trang đầu",
                last: "Trang cuối",
                next: "Trang sau",
                previous: "Trang trước"
            }
        }
    })
    $('#ThisMonthNew').DataTable({
        data: newThisMonthList,
        columns: tableLabels,
        ordering: false,
        info: false,
        scrollX: true,
        scrollY: true,
        searching: false,
        lengthChange: false,
        scrollCollapse: true,
        language: {
            emptyTable: "Không có phương tiện nào",
            paginate: {
                first: "Trang đầu",
                last: "Trang cuối",
                next: "Trang sau",
                previous: "Trang trước"
            }
        }
    });
    $('#PredictThisMonth').DataTable({
        columnDefs: { className: "dt-center", targets: "_all" },
        data: notOkList,
        columns: tableLabels,
        ordering: false,
        info: false,
        scrollX: true,
        scrollY: true,
        searching: false,
        lengthChange: false,
        scrollCollapse: true,
        language: {
            emptyTable: "Không có phương tiện nào",
            paginate: {
                first: "Trang đầu",
                last: "Trang cuối",
                next: "Trang sau",
                previous: "Trang trước"
            }
        }
    });

    // Handle Actionable in table
    $('#SearchAll tbody').on('click', '.bxs-trash', async function () {
        let temp = mainTable.row($(this).parents('tr')).data();
        let text = "Bạn có chắc chắn muốn xóa phương tiện với biển số: " + temp.plateNumber + " không?";
        if (confirm(text) == true) {
            await deleteVehicle(temp.id);
            await new Promise(resolve => setTimeout(resolve, 500))
            await getData(data.tokenType + " " + data.accessToken, "update");
        }
    })

    $('#SearchAll tbody').on('click', '.bx-check-square', async function () {
        let temp = mainTable.row($(this).parents('tr')).data();
        let text = "Xác nhận tái đăng kiểm lại phương tiện với viển số " + temp.plateNumber;
        if (confirm(text) == true) {
            await checkVehicle(temp.id);
            await new Promise(resolve => setTimeout(resolve, 500))
            await getData(data.tokenType + " " + data.accessToken, "update");
        }
    })
}

async function checkVehicle(id) {
    await fetch("/api/check/vehicle", {
        method: "POST",
        headers: {
            "Authorization": data.tokenType + " " + data.accessToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
    }).then(response => {
        if (response.status == 200) {
            alert("Tái đăng kiểm phương tiện thành công")
        } else {
            alert("Không tìm thấy phương tiện trên server")
            console.log(response)
        }
    })
}

async function deleteVehicle(id) {
    await fetch("/api/delete/vehicle", {
        method: "DELETE",
        headers: {
            "Authorization": data.tokenType + " " + data.accessToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
    }).then(response => {
        if (response.status == 200) {
            alert("Phương tiện đã được xóa khỏi hệ thống")
        } else {
            alert("Không tồn tại phương tiện trên hệ thống")
            console.log(response)
        }
    })
}

async function deleteUser(id) {
    await fetch("/api/auth/delete/user", {
        method: "DELETE",
        headers: {
            "Authorization": data.tokenType + " " + data.accessToken,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(id),
    }).then(response => {
        if (response.status == 200) {
            alert("Người dùng đã được xóa khỏi hệ thống")
        } else {
            alert("Không tồn tại người dùng trên hệ thống")
            console.log(response)
        }
    })
}

function convertRegion(strRegion) {
    let converter = {
        "AN_GIANG": "An Giang",
        "BA_RIA_VUNG_TAU": "Bà Rịa Vũng Tàu",
        "BAC_LIEU": "Bạc Liêu",
        "BAC_GIANG": "Bắc Giang",
        "BAC_KAN": "Bắc Kạn",
        "BAC_NINH": "Bắc Ninh",
        "BEN_TRE": "Bến Tre",
        "BINH_DUONG": "Bình Dương",
        "BINH_DINH": "Bình Định",
        "BINH_PHUOC": "Bình Phước",
        "BINH_THUAN": "Bình Thuận",
        "CA_MAU": "Cà Mau",
        "CAO_BANG": "Cao Bằng",
        "CAN_THO": "Cần Thơ",
        "DA_NANG": "Đà Nẵng",
        "DAK_LAK": "Đắk Lắk",
        "DAK_NONG": "Đắk Nông",
        "DIEN_BIEN": "Điện Biên",
        "DONG_NAI": "Đồng Nai",
        "DONG_THAP": "Đồng Tháp",
        "GIA_LAI": "Gia Lai",
        "HA_GIANG": "Hà Giang",
        "HA_NAM": "Hà Nam",
        "HA_NOI": "Hà Nội",
        "HA_TINH": "Hà Tĩnh",
        "HAI_DUONG": "Hải Dương",
    }
    if (converter[strRegion] != undefined) {
        return converter[strRegion];
    } else {
        return "ERROR";
    }

}

function SwtichSection(current) {
    if (current == "ADMIN") {
        getAccList(data.tokenType + " " + data.accessToken);
    }
    if (currentDisplay.id != current) {
        currentDisplay.classList.add('slide-left');
        let temp = document.getElementById(current);
        temp.hidden = false;
        new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
            currentDisplay.classList.remove('slide-left');
            currentDisplay.hidden = true;
            currentDisplay = temp;
        });
    }
}

async function getAccList(key) {
    await fetch('/api/auth/get/users', {
        method: "GET",
        headers: {
            "Authorization": key,
        }
    }).then(response => {
        response.json().then(list => {
            if (!$.fn.DataTable.isDataTable('#AccountList')) {
                let accountLabels = [
                    { title: 'ID', data: 'id', className: "dt-center small" },
                    { title: 'Tên người dùng', data: 'username', className: "dt-center small" },
                    { title: 'email', data: 'email', className: "dt-center small" },
                    {
                        title: 'Vai trò', data: null, className: "dt-center small", render: function (data, type, row) {
                            let output = "Đăng Ký Viên"
                            for (let i = 0; i < data.roles.length; i++) {
                                if (data.roles[i].name == "ROLE_ADMIN") {
                                    return "ADMIN";
                                } else if (data.roles[i].name == "ROLE_MODERATOR") {
                                    output = "Kiểm Duyệt Viên";
                                }
                            }
                            return output;
                        }
                    },
                    {
                        title: 'Tỉnh thành', data: null, className: "dt-center small", render: function (data, type, row) {
                            return convertRegion(data.region.name)
                        }
                    },
                    { title: 'Hành động', data: null, className: "dt-center small", defaultContent: "<i class='bx bxs-trash bx-sm actionable'></i>" }
                ]
                let AdminTable = $('#AccountList').DataTable({
                    data: list,
                    columns: accountLabels,
                    createdRow: function (row, data, index) {
                        if (data.roles.some(e => e.name === "ROLE_ADMIN")) {
                            $(row).find('.bxs-trash').addClass('disable')
                        }
                    },
                    info: false,
                    lengthChange: false,
                    language: {
                        emptyTable: "Không có phương tiện nào",
                        paginate: {
                            first: "Trang đầu",
                            last: "Trang cuối",
                            next: "Trang sau",
                            previous: "Trang trước"
                        }
                    }
                })

                $('#AccountList tbody').on('click', '.bxs-trash', async function () {
                    let temp = AdminTable.row($(this).parents('tr')).data();
                    let text = "Bạn có chắc chắn muốn xóa tài khoản với tên: " + temp.username + " không?";
                    if (confirm(text) == true) {
                        await deleteUser(temp.id);
                        await new Promise(resolve => setTimeout(resolve, 500))
                        await getAccList(data.tokenType + " " + data.accessToken);
                    }
                })
            } else {
                let AccountTable = $('#AccountList').DataTable();
                AccountTable.clear();
                AccountTable.rows.add(list);
                AccountTable.draw();
            }
        })
    })
}