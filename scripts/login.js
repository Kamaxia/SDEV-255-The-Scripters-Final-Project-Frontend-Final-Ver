let token

document.getElementById("login-form").addEventListener("submit", function (event) {
    event.preventDefault();
    let isValid = true;

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    if (!email.value.includes("@")) {
        document.getElementById("email-error").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("email-error").style.display = "none";
    }

    if (!password.value.trim()) {
        document.getElementById("password-error").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("password-error").style.display = "none";
    }

    if (isValid) {
        login(email.value, password.value);
    }
});

async function login(email, password) {
    document.querySelector("#errorMsg").innerHTML = "";

    // Make the login request
    const response = await fetch("https://petalite-immediate-vase.glitch.me/api/auth/login", {
        method: "POST",
        body: new URLSearchParams({
            email: email,
            password: password
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    if (response.ok) {
        const tokenResponse = await response.json();
        const { token, userType, userId } = tokenResponse; // Destructure to get userId

        // Store the token, userType, and userId in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
        localStorage.setItem("userType", userType);
        localStorage.setItem("userId", userId); // Save the user ID

        if (userType === "student") {
            window.location.href = "schedule.html"; // Redirect to student dashboard
        } else if (userType === "teacher") {
            window.location.href = "teacherCourses.html"; // Redirect to teacher dashboard
        } else {
            document.querySelector("#errorMsg").innerHTML = "Unknown user type.";
        }
    } else {
        document.querySelector("#errorMsg").innerHTML = "Invalid email or password.";
    }
}


// Function to determine user type (student or teacher)
// Assuming school emails use @catalyst.edu domain
function getUserType(email) {
    const studentDomain = "@student.catalyst.edu"; 
    const teacherDomain = "@catalyst.edu"
    if (email.endsWith(studentDomain)) {
        return "student";
    }
    if (email.endsWith(teacherDomain)) {
        return "teacher";
    }
    return "unknown"; 
}

// Forgot Password functionality (Placeholder)
document.getElementById("forgot-password").addEventListener("click", function (event) {
    event.preventDefault();
    alert("Forgot Password functionality coming soon.");
});