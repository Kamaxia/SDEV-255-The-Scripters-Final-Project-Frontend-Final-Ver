document.getElementById("student-btn").addEventListener("click", function() {
    document.getElementById("role-selection").style.display = "none";
    document.getElementById("back-btn").style.display = "block";
    document.getElementById("student-form").style.display = "block";
});

document.getElementById("teacher-btn").addEventListener("click", function() {
    document.getElementById("role-selection").style.display = "none";
    document.getElementById("back-btn").style.display = "block";
    document.getElementById("teacher-form").style.display = "block";
});

// Validate student form
document.getElementById("student-signup").addEventListener("submit", async function(event) {
    event.preventDefault();
    let isValid = true;

    const fullName = document.getElementById("student-name");
    const email = document.getElementById("student-email");
    const password = document.getElementById("student-password");
    const passwordConfirm = document.getElementById("student-password-confirm");
    const schoolDomain = "@student.catalyst.edu"; 

    if (!fullName.value.trim()) {
        document.getElementById("name-error").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("name-error").style.display = "none";
    }

    // School email validation
    if (!email.value.includes(schoolDomain)) {
        document.getElementById("email-error").style.display = "block";
        document.getElementById("email-error").textContent = "Please enter a valid school email address (e.g., @student.catalyst.edu).";
        isValid = false;
    } else {
        document.getElementById("email-error").style.display = "none";
    }

    if (password.value.length < 6) {
        document.getElementById("password-error").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("password-error").style.display = "none";
    }

    if (password.value !== passwordConfirm.value) {
        document.getElementById("confirm-password-error").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("confirm-password-error").style.display = "none";
    }

    if (isValid) {
        try {
            const response = await fetch("https://petalite-immediate-vase.glitch.me/api/students/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: fullName.value,  
                    email: email.value,
                    password: password.value
                })
            });

            // Check if the response is JSON
            const contentType = response.headers.get("Content-Type");

            let result;
            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
            } else {
                result = await response.text();
            }

            if (response.ok) {
                alert("Signup successful. Please login to continue.");
                window.location.href = "index.html";
            } else {
                alert("User already exists. Please login."); 
            }
        } catch (error) {
            console.error("Error:", error);
            alert("There was an error with your signup.");
        }
    }
});

// Validate teacher form
document.getElementById("teacher-signup").addEventListener("submit", async function(event) {
    event.preventDefault();
    let isValid = true;

    const fullName = document.getElementById("teacher-name");
    const email = document.getElementById("teacher-email");
    const password = document.getElementById("teacher-password");
    const passwordConfirm = document.getElementById("teacher-password-confirm");
    const area = document.getElementById("teacher-area");
    const schoolDomain = "@catalyst.edu"; 

    // Validate Full Name
    if (!fullName.value.trim()) {
        document.getElementById("teacher-name-error").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("teacher-name-error").style.display = "none";
    }


    if (!email.value.includes(schoolDomain)) {
        document.getElementById("teacher-email-error").style.display = "block";
        document.getElementById("teacher-email-error").textContent = "Please enter a valid school email address (e.g., @catalyst.edu).";
        isValid = false;
    } else {
        document.getElementById("teacher-email-error").style.display = "none";
    }


    if (password.value.length < 6) {
        document.getElementById("teacher-password-error").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("teacher-password-error").style.display = "none";
    }


    if (password.value !== passwordConfirm.value) {
        document.getElementById("teacher-confirm-password-error").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("teacher-confirm-password-error").style.display = "none";
    }


    if (!area.value.trim()) {
        document.getElementById("teacher-area-error").style.display = "block";
        isValid = false;
    } else {
        document.getElementById("teacher-area-error").style.display = "none";
    }

    if (isValid) {
        try {
            const response = await fetch("https://petalite-immediate-vase.glitch.me/api/teachers/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: fullName.value,
                    email: email.value,
                    password: password.value,
                    area: area.value
                })
            });
        
            const contentType = response.headers.get("Content-Type");

            let result;
            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
            } else {
                result = await response.text();
            }
        
            if (response.ok) {
                alert("Signup successful. Please login to continue.");
                window.location.href = "index.html"; 
            } else {
                alert("User already exists. Please login."); 
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Signup failed. Please try again.");
        }
    }
});
