// SUPABASE CONNECTION

const { createClient } = window.supabase;

const supabaseUrl = "https://djvszoqsoxuuiurvxany.supabase.co";
const supabaseKey = "sb_publishable_yKOlVPcS19bbDeTuRT9CNA_O1LHyTS6";

const supabaseClient = createClient(supabaseUrl, supabaseKey);

console.log("Supabase connected!");

// TEST: Read sensor data from Supabase

// FETCH SENSOR READINGS FROM SUPABASE

async function loadSensorReadings() {

    // Get the three registered sensors
    const { data: sensorData, error: sensorError } =
        await supabaseClient
            .from("sensor")
            .select("*");

    if (sensorError) {
        console.error("Sensor error:", sensorError.message);
        return;
    }

    // Get readings from the database
    const { data: readingData, error: readingError } =
        await supabaseClient
            .from("sensor_readings")
            .select("*")
            .order("created_at", { ascending: false });

    if (readingError) {
        console.error("Reading error:", readingError.message);
        return;
    }

    // Update existing sensor objects
    sensorData.forEach(dbSensor => {

        const sensor = sensors.find(
            item => item.id === dbSensor.sensor_code
        );

        // Find the latest reading for this sensor
        const reading = readingData.find(
            item => item.sensor_id === dbSensor.id
        );

        if (sensor && reading) {

            sensor.waterLevel = Number(reading.water_level_cm);
            sensor.status = reading.status;
            sensor.flowRate = "--";

            sensor.lastPing = new Date(
                reading.created_at
            ).toLocaleString();
        }
    });

    console.log("Live sensor data loaded:", sensors);

    // Refresh dashboard
    displaySensors();
    updateDashboardSensors();
    updatePipeStatus();
    updateSummaryCards();
    displayAlerts();
    updateDrainagePipe();
}


// ======================================
// SMART DRAINAGE MONITORING SYSTEM
// JavaScript - script.js
// ======================================


// 1. SAMPLE SENSOR DATA


// 1. SAMPLE SENSOR DATA


const sensors = [
    {
        id: "S001",
        location: "Inlet Position",
        waterLevel: 5,
        flowRate: 20,
        status: "Normal",
        lastPing: "Just now"
    },
    {
        id: "S002",
        location: "Middle Position",
        waterLevel: 12,
        flowRate: 15,
        status: "Warning",
        lastPing: "Just now"
    },
    {
        id: "S003",
        location: "Outlet Position",
        waterLevel: 20,
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
           <td>${sensor.flowRate === "--" ? "Not available" : sensor.flowRate + " L/min"}</td>
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
    updateMapStatus();
}
function updatePipeStatus() {
    const pipeStatus = document.getElementById("pipeStatus");

    if (!pipeStatus) return;

    if (sensors.some(sensor => sensor.status === "Critical")) {
        pipeStatus.textContent = "Water Level: Critical";
    } else if (sensors.some(sensor => sensor.status === "Warning")) {
        pipeStatus.textContent = "Water Level: Warning";
    } else {
        pipeStatus.textContent = "Water Level: Normal";
    }
}
// UPDATE DASHBOARD SUMMARY CARDS

function updateSummaryCards() {

    const activeAlerts = sensors.filter(
        sensor => sensor.status === "Warning" ||
                  sensor.status === "Critical"
    ).length;

    const normalSensors = sensors.filter(
        sensor => sensor.status === "Normal"
    ).length;

    document.getElementById("activeAlerts").textContent =
        activeAlerts;

    document.getElementById("normalSensors").textContent =
        normalSensors;
}
// UPDATE DRAINAGE MAP SENSOR STATUS
function updateMapStatus() {

    sensors.forEach((sensor, index) => {

        const marker = document.getElementById(`mapMarker${index + 1}`);
        const statusText = document.getElementById(`mapStatus${index + 1}`);

        if (!marker || !statusText) return;

        const status = sensor.status.toLowerCase();

        marker.classList.remove(
            "normal-marker",
            "warning-marker",
            "critical-marker"
        );

        if (status === "normal") {
            marker.classList.add("normal-marker");
        } 
        else if (status === "warning") {
            marker.classList.add("warning-marker");
        } 
        else if (status === "critical") {
            marker.classList.add("critical-marker");
        }

        statusText.textContent = sensor.status;
    });
}
// DEMO MODE: Test all three sensors together

function testScenario(condition) {

    let levels = [];

    if (condition === "Normal") {
        levels = [5, 6, 7];
    } 
    else if (condition === "Warning") {
        levels = [12, 13, 14];
    } 
    else if (condition === "Critical") {
        levels = [20, 22, 25];
    }

    sensors.forEach((sensor, index) => {
        sensor.waterLevel = levels[index];
        sensor.status = condition;
    });

    updateSensorCards();
    displaySensors();
    displayAlerts();
    updateDashboardSensors();
    updateDrainagePipe();
    updatePipeStatus();
    updateSummaryCards();
}


// RESET DEMO: Restore original readings

function resetDemo() {

    const originalLevels = [5, 12, 20];
    const originalStatuses = ["Normal", "Warning", "Critical"];

    sensors.forEach((sensor, index) => {
        sensor.waterLevel = originalLevels[index];
        sensor.status = originalStatuses[index];
    });

    updateSensorCards();
    displaySensors();
    displayAlerts();
    updateDashboardSensors();
    updateDrainagePipe();
    updatePipeStatus();
    updateSummaryCards();
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
    grievanceForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const name = document.getElementById("citizenName").value.trim();
        const email = document.getElementById("citizenEmail").value.trim();
        const problem = document.getElementById("problemType").value;
        const location = document.getElementById("location").value.trim();
        const description = document.getElementById("description").value.trim();

        const photoFile = document.getElementById("problemPhoto").files[0];

        let photoPath = null;

        try {
            // Upload photo to Supabase Storage
            if (photoFile) {
                if (photoFile.size > 5 * 1024 * 1024) {
                    alert("Photo must be smaller than 5 MB.");
                    return;
                }

                if (!["image/jpeg", "image/png"].includes(photoFile.type)) {
                    alert("Please upload a JPG or PNG image.");
                    return;
                }

                const safeFileName = photoFile.name.replace(
                    /[^a-zA-Z0-9._-]/g, "_"
                );

                const filePath = Date.now() + "_" + safeFileName;

                const { data: uploadData, error: uploadError } =
                    await supabaseClient.storage
                        .from("complaint-photos")
                        .upload(filePath, photoFile);

                if (uploadError) throw uploadError;

                photoPath = uploadData.path;
            }

            // Save complaint details in database
            const { error: insertError } = await supabaseClient
                .from("complaints")
                .insert([{
                    citizen_name: name,
                    citizen_email: email,
                    problem_type: problem,
                    location: location,
                    description: description,
                    photo_path: photoPath
                }]);

            if (insertError) throw insertError;

            alert("Complaint and photo submitted successfully!");

            grievanceForm.reset();

            document.getElementById("photoPreview").src = "";
            document.getElementById("photoPreview").style.display = "none";
            document.getElementById("removePhoto").hidden = true;

        } catch (error) {
            console.error("Complaint submission error:", error);
            alert("Submission failed: " + error.message);
        }
    });
}

// 6. UPDATE THREE PIPE WATER LEVELS

function updateDrainagePipe() {

    // Maximum demonstration water height inside the pipe
    const maxPipeHeight = 30;

    sensors.forEach((sensor, index) => {

        const waterSection = document.getElementById(
            `water${index + 1}`
        );

        if (!waterSection) return;

        // Convert water height in cm into percentage
        let percentage =
            (sensor.waterLevel / maxPipeHeight) * 100;

        // Keep the water inside the pipe
        percentage = Math.max(0, Math.min(100, percentage));

        // Update this sensor's water section
        waterSection.style.height = percentage + "%";
    });
}


// Your existing initialization code...

displaySensors();
displayAlerts();
updateDashboardSensors();
updateDrainagePipe();
updatePipeStatus();

// Load actual readings from Supabase
loadSensorReadings();

console.log("Dashboard loaded!");