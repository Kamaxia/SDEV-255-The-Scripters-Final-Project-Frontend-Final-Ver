window.onload = function () {
    const token = localStorage.getItem("token");
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");

    if (token) {
        
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

document.addEventListener("DOMContentLoaded", function () {
    const studentId = localStorage.getItem("userId");

    if (!studentId) {
        alert("Please log in to view your schedule.");
        window.location.href = "login.html"; // Redirect to login page if no user ID
        return;
    }

    // Function to fetch and display the schedule
    function fetchSchedule() {
        fetch(`https://petalite-immediate-vase.glitch.me/api/students/${studentId}/detailed-schedule`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.message);  // Display error message if student not found or other errors
                    return;
                }

                // Display total courses and credits
                document.getElementById("totalCourses").textContent = `Total Courses: ${data.totalCourses}`;
                document.getElementById("totalCredits").textContent = `Total Credits: ${data.totalCredits}`;

                // Display the detailed schedule by day
                const scheduleContainer = document.getElementById("scheduleByDay");

                Object.keys(data.scheduleByDay).forEach(day => {
                    const daySection = document.createElement("div");
                    daySection.classList.add("day-section");

                    // Create day header
                    const dayHeader = document.createElement("h4");
                    dayHeader.textContent = day;
                    daySection.appendChild(dayHeader);

                    // Create a list of courses for this day
                    const courseList = document.createElement("ul");
                    data.scheduleByDay[day].forEach(course => {
                        const courseItem = document.createElement("li");
                        courseItem.classList.add("course-item");

                        const courseTitle = document.createElement("strong");
                        courseTitle.textContent = course.title;

                        const instructor = document.createElement("span");
                        instructor.textContent = ` (Instructor: ${course.instructor})`;

                        const method = document.createElement("span");
                        method.textContent = ` (Method: ${course.method})`;

                        courseItem.appendChild(courseTitle);
                        courseItem.appendChild(instructor);
                        courseItem.appendChild(method);
                        courseList.appendChild(courseItem);
                    });

                    daySection.appendChild(courseList);
                    scheduleContainer.appendChild(daySection);
                });
            })
            .catch(error => {
                console.error("Error fetching schedule:", error);
                alert("Error fetching your schedule.");
            });
    }

    fetchSchedule();
});
