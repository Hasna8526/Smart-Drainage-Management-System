
// ======================================
// SMART DRAINAGE MONITORING SYSTEM
// JavaScript - script.js
// ======================================


// 1. SAMPLE SENSOR DATA

const sensors = [
    {
        id: "S001",
        location: "Inlet Position",
        waterLevel: 12,
        flowRate: 20,
        status: "Normal",
        lastPing: "Just now"
    },
    {
        id: "S002",
        location: "Middle Position",
        waterLevel: 35,
        flowRate: 15,
        status: "Warning",
        lastPing: "Just now"
    },
    {
        id: "S003",
        location: "Outlet Position",
        waterLevel: 65,
        flowRate: 5,
        status: "Critical",
        lastPing: "Just now"
    }
];
function updateSensorCards() {
    sensors.forEach((sensor, index) => {
        const number = index + 1;

        document.getElementById(`sensor${number}Distance`).textContent =
            sensor.waterLevel + " cm";

        document.getElementById(`sensor${number}Text`).textContent =
            sensor.status;

        const indicator = document.getElementById(`sensor${number}Status`);

        indicator.className = "status-indicator";

        if (sensor.status === "Normal") {
            indicator.style.backgroundColor = "green";
        } else if (sensor.status === "Warning") {
            indicator.style.backgroundColor = "orange";
        } else {
            indicator.style.backgroundColor = "red";
        }
    });
}


// 2. DISPLAY SENSOR TABLE

function displaySensors() {

    const tableBody = document.getElementById("sensorTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    sensors.forEach(sensor => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${sensor.id}</td>
            <td>${sensor.location}</td>
            <td>${sensor.waterLevel} cm</td>
            <td>${sensor.flowRate} L/min</td>
            <td>${sensor.status}</td>
            <td>${sensor.lastPing}</td>
        `;

        tableBody.appendChild(row);

    });

}


// 3. UPDATE DASHBOARD CARDS


function updateDashboardSensors() {

    const pipeClasses = [
        "sensor-one",
        "sensor-two",
        "sensor-three"
    ];

    sensors.forEach((sensor, index) => {

        const number = index + 1;

        const distance = document.getElementById(
            `sensor${number}Distance`
        );

        const statusText = document.getElementById(
            `sensor${number}Text`
        );

        const indicator = document.getElementById(
            `sensor${number}Status`
        );

        const color =
            sensor.status === "Critical" ? "red" :
            sensor.status === "Warning" ? "orange" :
            "green";

        if (distance) {
            distance.textContent = sensor.waterLevel + " cm";
        }

        if (statusText) {
            statusText.textContent = sensor.status;
        }

        if (indicator) {
            indicator.style.backgroundColor = color;
        }

        const pipeSensor = document.querySelector(
            "." + pipeClasses[index]
        );

        if (pipeSensor) {
            pipeSensor.style.backgroundColor = color;
            pipeSensor.style.color = "white";
        }
    });
}
function testSensor(number, level, status) {

    sensors[number - 1].waterLevel = level;
    sensors[number - 1].status = status;

    // Refresh all dashboard sections
    updateSensorCards();
    displaySensors();
    updateDashboard();
    displayAlerts();
    updateDashboardSensors();
    updateDrainagePipe();

    console.log("Sensor " + number + " tested!");
}

// 4. DISPLAY ALERTS

function displayAlerts() {

    const alertsContainer =
        document.getElementById("alertsContainer");

    if (!alertsContainer) return;

    alertsContainer.innerHTML = "";

    const problemSensors = sensors.filter(
        sensor => sensor.status !== "Normal"
    );

    if (problemSensors.length === 0) {

        alertsContainer.innerHTML = "<p>No active alerts.</p>";
        return;

    }

    problemSensors.forEach(sensor => {

        const alert = document.createElement("div");

        alert.style.padding = "15px";
        alert.style.marginBottom = "12px";
        alert.style.borderRadius = "8px";

        if (sensor.status === "Critical") {
            alert.style.background = "#fee2e2";
            alert.style.color = "#991b1b";
        } else {
            alert.style.background = "#ffedd5";
            alert.style.color = "#9a3412";
        }

        alert.innerHTML = `
            <strong>${sensor.status} Alert</strong>
            <p>Sensor: ${sensor.id}</p>
            <p>Location: ${sensor.location}</p>
            <p>Water Level: ${sensor.waterLevel} cm</p>
        `;

        alertsContainer.appendChild(alert);

    });

}


// 5. PUBLIC GRIEVANCE FORM

const grievanceForm = document.getElementById("grievanceForm");

if (grievanceForm) {

    grievanceForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("citizenName").value;

        const problem = document.getElementById("problemType").value;

        const location = document.getElementById("location").value;

        alert(
            "Complaint submitted successfully!\n\n" +
            "Name: " + name +
            "\nProblem: " + problem +
            "\nLocation: " + location
        );

        grievanceForm.reset();

    });

}
// Initial dashboard display
displaySensors();
updateDashboard();
displayAlerts();
updateDashboardSensors();
updateDrainagePipe();

console.log("Dashboard loaded!");