
if (localStorage.getItem("user") == null) {
    window.location.replace("../")
} else {
    getData(data.tokenType + " " + data.accessToken);
}

const dashboard = document.getElementById('Dashboard'),
    search = document.getElementById('Search'),
    add = document.getElementById('Add'),
    predict = document.getElementById('Predict'),
    account = document.getElementById('ADMIN');
let currentDisplay = dashboard;

async function getData(key) {
    await fetch("/api/get/vehicle", {
        method: "GET",
        headers: {
            "Authorization": key
        }
    }).then(response => {
        response.json().then(text => {
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
                let today = new Date();
                let nextMonth = new Date(today.setMonth(today.getMonth() + 1));
                // Count the new Vehicles in the year
                if (today.getFullYear() == firstCycle.getFullYear()) {
                    countNewVehicles[firstCycle.getMonth()]++;
                }

                // Count the good, bad, and warning vehicles
                if (today.getFullYear() == firstCycle.getFullYear() && today.getMonth() == firstCycle.getMonth()) {
                    newVehicles.push(temp);
                    countGood++;
                } else if (nextCycle < nextMonth) {
                    countWarning++;
                    badWaringVehicles.push(nextCycle);
                } else if (nextCycle < today) {
                    countBad++;
                    badWaringVehicles.push(nextCycle);
                } else {
                    countGood++;
                }
            }
            initChart(countGood, countWarning, countBad, countNewVehicles);
            initTables(vehicleList, badWaringVehicles, newVehicles);
        })
    })
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
    });
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
    })
}

function initTables(entireList, notOkList, newThisMonthList) {
    let tableLabels = [
        { title: 'Biển số', data: "plateNumber", className: "dt-center small" },
        { title: 'Người đứng tên', data: "ownerName", className: "dt-center small" },
        { title: 'Điểm đăng kiểm', data: "lastRegion.name", className: "dt-center small" },
        { title: 'Ngày sẳn xuất', data: "createdDate", className: "dt-center small" },
        { title: 'Lần đăng kiểm cuối', data: "newestDate", className: "dt-center small" },
        { title: 'Hạn đăng kiểm tiếp', data: "nextCycle", className: "dt-center small" },
        { title: 'Tình trạng đăng kiểm', data: "checked", className: "dt-center small" }
    ]
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
}

function SwtichSection(current) {
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