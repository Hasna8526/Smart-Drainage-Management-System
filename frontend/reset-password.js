
const { createClient } = window.supabase;

const supabaseUrl = "https://djvszoqsoxuuiurvxany.supabase.co";

const supabaseKey = "sb_publishable_yKOlVPcS19bbDeTuRT9CNA_O1LHyTS6";

const supabaseClient = createClient(supabaseUrl, supabaseKey);


// Update Password
document.getElementById("resetForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const { data, error } = await supabaseClient.auth.updateUser({
        password: newPassword
    });

    if (error) {
        alert(error.message);
    } else {
        alert("Password updated successfully! Please login with your new password.");

        window.location.href = "login.html";
    }

});
