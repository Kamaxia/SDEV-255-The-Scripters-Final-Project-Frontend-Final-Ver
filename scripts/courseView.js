window.onload = function () {
    const token = localStorage.getItem("token");
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");
    const signupLink = document.getElementById("signup-link");

    if (token) {
        signupLink.style.display = "none"; // Hide signup link
        loginLink.style.display = "none"; // Hide login link
        logoutLink.style.display = "block"; // Show logout link
    } else {
        loginLink.style.display = "block"; // Show login link
        logoutLink.style.display = "none"; // Hide logout link
    }

    if (localStorage.getItem("userType") === "teacher") {
        document.getElementById("manager-link").style.display = "block";
    }
};

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userType");

    window.location.href = "index.html"; // Redirect to home page after logout
}

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("id");

    if (!courseId) {
        alert("Course ID is missing!");
        return;
    }

    try {
        // Make sure the courseId is correctly inserted in the URL
        const response = await fetch(`https://petalite-immediate-vase.glitch.me/api/classes/${courseId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch course data.");
        }
        const course = await response.json();

        // Call function to update UI
        updateCourseDetails(course);
    } catch (error) {
        console.error("Error loading course:", error);
        document.getElementById("courseTitle").textContent = "Error Loading Course";
        document.getElementById("courseDesc").textContent = "Please try again later.";
    }
});

function updateCourseDetails(course) {
    // Make sure elements exist before modifying them
    if (document.getElementById("courseTitle")) {
        document.getElementById("courseTitle").textContent = course.title || "No Title";
    }
    if (document.getElementById("courseDesc")) {
        document.getElementById("courseDesc").textContent = course.description || "No Description";
    }
    if (document.getElementById("courseInst")) {
        document.getElementById("courseInst").textContent = course.instructor || "Unknown";
    }
    if (document.getElementById("courseSched")) {
        document.getElementById("courseSched").textContent = course.schedule || "TBD";
    }
    if (document.getElementById("courseMeth")) {
        document.getElementById("courseMeth").textContent = course.method || "Unknown";
    }
}

async function enroll() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("id");

    if (!courseId) {
        alert("Course ID is missing!");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login to enroll in a course.");
        return;
    }

    const studentId = localStorage.getItem("userId");

    try {
        // Make the enroll request
        const response = await fetch(`https://petalite-immediate-vase.glitch.me/api/students/${studentId}/enroll/${courseId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert("Enrollment successful!");
            window.location.href = "schedule.html"; // Redirect to student dashboard
        } else {
            const error = await response.json();
            alert(error.error || "Failed to enroll in course.");
        }
    } catch (error) {
        console.error("Error enrolling in course:", error);
    }
}

async function dropCourse() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("id");

    if (!courseId) {
        alert("Course ID is missing!");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login to drop the course.");
        return;
    }

    const studentId = localStorage.getItem("userId");

    try {
        // Make the drop request
        const response = await fetch(`https://petalite-immediate-vase.glitch.me/api/students/${studentId}/drop/${courseId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert("Successfully dropped the course!");
            document.getElementById("dropBtn").style.display = "none"; // Hide the Drop button
            // Optionally, you can redirect to another page (e.g., student dashboard)
            window.location.href = "schedule.html"; // Redirect to student dashboard
        } else {
            const error = await response.json();
            alert(error.error || "Failed to drop the course.");
        }
    } catch (error) {
        console.error("Error dropping course:", error);
    }
}
