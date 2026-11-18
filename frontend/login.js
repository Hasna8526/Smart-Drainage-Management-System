// Connect login page to Supabase

const { createClient } = window.supabase;

const supabaseUrl = "https://djvszoqsoxuuiurvxany.supabase.co";

const supabaseKey = "sb_publishable_yKOlVPcS19bbDeTuRT9CNA_O1LHyTS6";

const supabaseClient = createClient(supabaseUrl, supabaseKey);

console.log("Login page connected to Supabase!");

let selectedRole = "";
let isRegistering = false;

function selectRole(role) {

    selectedRole = role;
    isRegistering = false;

    document.querySelector(".role-container").style.display = "none";
    document.getElementById("formContainer").style.display = "block";

    updateForm();
}

function updateForm() {

    const title = document.getElementById("formTitle");
    const subtitle = document.getElementById("formSubtitle");
    const nameField = document.getElementById("citizenName");
    const registerText = document.getElementById("registerText");
    const submitButton = document.getElementById("submitButton");

    if (selectedRole === "citizen") {

        nameField.style.display = isRegistering ? "block" : "none";
        nameField.required = isRegistering;

        title.textContent = isRegistering
            ? "Citizen Registration"
            : "Citizen Login";

        subtitle.textContent = "Access your citizen account";

        registerText.style.display = "block";

        submitButton.textContent = isRegistering
            ? "Create Account"
            : "Login";

        document.getElementById("registerLink").textContent =
            isRegistering ? "Login here" : "Create an account";

    } else {

        nameField.style.display = "none";
        nameField.required = false;

        title.textContent = "Admin Login";
        subtitle.textContent = "Authorized administrators only";

        registerText.style.display = "none";
        submitButton.textContent = "Admin Login";
    }
}

document.getElementById("registerLink").addEventListener("click", function(event) {

    event.preventDefault();

    isRegistering = !isRegistering;
    updateForm();

});

document.getElementById("backButton").addEventListener("click", function() {

    document.getElementById("formContainer").style.display = "none";
    document.querySelector(".role-container").style.display = "grid";

});

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // Get form details
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("citizenName").value;

    // Citizen Registration
    if (selectedRole === "citizen" && isRegistering) {

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                }
            }
        });

        
        if (error) {
            alert(error.message);
        } else {
            alert("Registration successful! Please check your email if verification is required.");
            console.log(data);
        }
    }

    // Citizen Login
    else if (selectedRole === "citizen" && !isRegistering) {

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Citizen Login Successful!");

            console.log("Logged in user:", data.user);

            window.location.href = "index.html";
        }
    }
});

// Forgot Password
document.getElementById("forgotPassword").addEventListener("click", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    if (!email) {
        alert("Please enter your registered email address first.");
        return;
    }

    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email);

    if (error) {
        alert(error.message);
    } else {
        alert("Password reset email sent! Please check your inbox.");
    }
});

