

const { createClient } = window.supabase;

const supabaseUrl = "https://djvszoqsoxuuiurvxany.supabase.co";

const supabaseKey = "sb_publishable_yKOlVPcS19bbDeTuRT9CNA_O1LHyTS6";

const supabaseClient = createClient(supabaseUrl, supabaseKey);


// Check password recovery session
async function checkRecoverySession() {

    const { data, error } = await supabaseClient.auth.getSession();

    if (error || !data.session) {
        alert("Please open this page using the password reset link sent to your email.");
        return false;
    }

    console.log("Password recovery session detected!");
    return true;
}


// Update Password
document.getElementById("resetForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const hasSession = await checkRecoverySession();

    if (!hasSession) {
        return;
    }

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
