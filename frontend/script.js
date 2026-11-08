
// ======================================
// SMART DRAINAGE MONITORING SYSTEM
// JavaScript - script.js
// ======================================


// 1. SAMPLE SENSOR DATA

const sensors = [
    {
        id: "S001",
        location: "Main Road",
        waterLevel: 12,
        flowRate: 20,
        status: "Normal",
        lastPing: "Just now"
    },
    {
        id: "S002",
        location: "Market Area",
        waterLevel: 35,
        flowRate: 15,
        status: "Warning",
        lastPing: "Just now"
    },
    {
        id: "S003",
        location: "Bus Stand",
        waterLevel: 65,
        flowRate: 5,
        status: "Critical",
        lastPing: "Just now"
    },
    {
        id: "S004",
        location: "College Road",
        waterLevel: 18,
        flowRate: 22,
        status: "Normal",
        lastPing: "Just now"
    }
];


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

function updateDashboard() {

    const totalSensors = sensors.length;

    const normalSensors = sensors.filter(
        sensor => sensor.status === "Normal"
    ).length;

    const activeAlerts = sensors.filter(
        sensor => sensor.status !== "Normal"
    ).length;

    const maximumLevel = Math.max(
        ...sensors.map(sensor => sensor.waterLevel)
    );

    document.getElementById("totalSensors").textContent = totalSensors;

    document.getElementById("normalSensors").textContent = normalSensors;

    document.getElementById("activeAlerts").textContent = activeAlerts;

    document.getElementById("waterLevel").textContent = maximumLevel + " cm";

    document.getElementById("currentWaterLevel").textContent =
        maximumLevel + " cm";

    let waterStatus = "Normal";

    if (maximumLevel >= 60) {
        waterStatus = "Critical - Overflow Risk!";
    } else if (maximumLevel >= 30) {
        waterStatus = "Warning - Water Level Rising";
    }

    document.getElementById("waterStatus").textContent = waterStatus;

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


// 6. START DASHBOARD

displaySensors();

updateDashboard();

displayAlerts();

console.log("Smart Drainage Dashboard Loaded Successfully!");
