let vehicleList;
if (localStorage.getItem("user") == null) {
    window.location.replace("../")
} else {
    const response = fetch("/api/get/vehicle", {
        method: "GET",
        headers: {
            "Authorization": data.tokenType + " " + data.accessToken
        }
    }).then(response => {
        response.json().then(text => {
            for(let i = 0; i < text.length; i++) {
                let temp = moment(text[i].nextCycle,"YYYY-MM-DD").toDate();
                if(temp < Date.now()) {
                    console.log("expire")
                    console.log(temp.toLocaleString());
                }else {
                    console.log(temp.toLocaleString())
                    console.log("valid")
                }
            }
        })
    })
}

const dashboard = document.getElementById('Dashboard'),
    search = document.getElementById('Search'),
    add = document.getElementById('Add'),
    predict = document.getElementById('Predict'),
    account = document.getElementById('ADMIN');
let currentDisplay = dashboard;

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

//Testing chart and table

var xValues = ["Còn Hạn", "Sắp Hết Hạn", "Quá Hạn"];
var yValues = [1, 1, 1];
var barColors = [
    "#00FF00",
    "#FFFF00",
    "#FF0000"
];
new Chart("ChartPredict", {
    type: "pie",
    data: {
        labels: xValues,
        datasets: [{
            backgroundColor: barColors,
            data: yValues
        }]
    },
    options: {
        title: {
            display: true,
            text: "Tình trạng đăng kiểm của toàn bộ các xe trong tháng này"
        }
    }
});

var xYear = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
var yYear = [5, 8, 9, 1, 0, 0, 0, 0, 0];
new Chart("ChartThisYear", {
    type: "bar",
    data: {
        labels: xYear,
        datasets: [{
            backgroundColor: "lightblue",
            data: yYear
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

var dataSet = [
    ['Tiger Nixon', 'System Architect', 'Edinburgh', '5421', '2011/04/25', '$320,800'],
    ['Garrett Winters', 'Accountant', 'Tokyo', '8422', '2011/07/25', '$170,750'],
    ['Ashton Cox', 'Junior Technical Author', 'San Francisco', '1562', '2009/01/12', '$86,000'],
];

$(document).ready(function () {
    $('#example').DataTable({
        data: dataSet,
        columns: [
            { title: 'Name' },
            { title: 'Position' },
            { title: 'Office' },
            { title: 'Extn.' },
            { title: 'Start date' },
            { title: 'Salary' },
        ],
        ordering: false,
        info: false,
        scrollX: true,
        scrollY: true,
        searching: false,
        lengthChange: false,
    });

    $('#example1').DataTable({
        data: dataSet,
        columns: [
            { title: 'Name' },
            { title: 'Position' },
            { title: 'Office' },
            { title: 'Extn.' },
            { title: 'Start date' },
            { title: 'Salary' },
        ],
        ordering: false,
        info: false,
        scrollX: true,
        scrollY: true,
        searching: false,
        lengthChange: false,
    });
});