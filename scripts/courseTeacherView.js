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
        // Fetch the course data from the server
        const response = await fetch(`https://petalite-immediate-vase.glitch.me/api/classes/${courseId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch course data.");
        }
        const course = await response.json();

        // Populate the page with course data (view mode)
        document.getElementById("courseTitle").textContent = course.title || "No Title";
        document.getElementById("courseDesc").textContent = course.description || "No Description";
        document.getElementById("courseInst").textContent = course.instructor || "Unknown";
        document.getElementById("courseSched").textContent = course.schedule || "TBD";
        document.getElementById("courseMeth").textContent = course.method || "Unknown";

        // Populate the edit form with the course data
        document.getElementById("editCourseTitle").value = course.title || "";
        document.getElementById("editCourseDesc").value = course.description || "";
        document.getElementById("editCourseSched").value = course.schedule.join(", ") || "";
        document.getElementById("editCourseMeth").value = course.method || "online";

    } catch (error) {
        console.error("Error loading course:", error);
        alert("Error loading course data");
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

function editClass() {
    // Hide course info and show the edit form
    document.getElementById("courseTitle").style.display = "none";
    document.getElementById("courseDesc").style.display = "none";
    document.getElementById("courseInst").style.display = "none";
    document.getElementById("courseSched").style.display = "none";
    document.getElementById("courseMeth").style.display = "none";

    // Show the edit form
    document.getElementById("editCourseForm").style.display = "block";
}

// Submit Course Edit
async function submitCourseEdit(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("id");

    const updatedCourse = {
        title: document.getElementById("editCourseTitle").value,
        description: document.getElementById("editCourseDesc").value,
        schedule: document.getElementById("editCourseSched").value.split(","),
        method: document.getElementById("editCourseMeth").value,
        teacherId: localStorage.getItem("userId"), 
    };

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`https://petalite-immediate-vase.glitch.me/api/teachers/classes/${courseId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(updatedCourse),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Course updated successfully!");
            // Switch back to view mode and show the updated data
            document.getElementById("editCourseForm").style.display = "none";
            document.getElementById("courseTitle").style.display = "block";
            document.getElementById("courseDesc").style.display = "block";
            document.getElementById("courseInst").style.display = "block";
            document.getElementById("courseSched").style.display = "block";
            document.getElementById("courseMeth").style.display = "block";

            // Update the displayed data
            document.getElementById("courseTitle").textContent = updatedCourse.title;
            document.getElementById("courseDesc").textContent = updatedCourse.description;
            document.getElementById("courseSched").textContent = updatedCourse.schedule.join(", ");
            document.getElementById("courseMeth").textContent = updatedCourse.method;
        } else {
            alert(`Error: ${result.error || "Failed to update course"}`);
        }
    } catch (error) {
        console.error("Error updating course:", error);
        alert("An error occurred while updating the course.");
    }
}

// Delete Course
async function deleteClass() {
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get("id");
    const teacherId = localStorage.getItem("userId");

    // Confirm before deleting
    const confirmDelete = confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch(`https://petalite-immediate-vase.glitch.me/api/teachers/classes/${classId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ teacherId })
        });

        const result = await response.json();
        if (response.ok) {
            alert("Course deleted successfully!");
            window.location.href = "teacherCourses.html"; // Redirect to courses list
        } else {
            alert(`Error: ${result.error || "Failed to delete course"}`);
        }
    } catch (error) {
        console.error("Error deleting course:", error);
        alert("An error occurred while deleting the course.");
    }
}
