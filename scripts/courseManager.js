window.onload = function () {
    getClass(); // Call getClass to load courses initially
    const token = localStorage.getItem("token");
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");
    const signupLink = document.getElementById("signup-link");

    // Hide/show links based on login status
    if (token) {
        signupLink.style.display = "none";
        loginLink.style.display = "none";
        logoutLink.style.display = "block";
    } else {
        loginLink.style.display = "block";
        logoutLink.style.display = "none";
    }

    if (localStorage.getItem("userType") === "teacher") {
        document.getElementById("manager-link").style.display = "block";
    }

    const addCourseForm = document.getElementById("addCourseForm");
    addCourseForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        // Capture form values
        const courseTitle = document.getElementById("courseTitle").value;
        const courseDesc = document.getElementById("courseDesc").value;
        const courseSched = document.getElementById("courseSched").value.split(','); // Assuming schedule is a comma-separated list
        const courseMeth = document.getElementById("courseMeth").value;
        const courseSubject = document.getElementById("courseSubject").value;
        const courseCredits = parseInt(document.getElementById("courseCredits").value, 10);

        // Ensure teacherId is in localStorage
        const teacherId = localStorage.getItem("userId");
        if (!teacherId) {
            console.error("Teacher ID not found in localStorage");
            return;
        }

        // Ensure all fields are populated
        if (!courseTitle || !courseDesc || !courseSched || !courseMeth || !courseSubject || !courseCredits) {
            console.error("Missing required fields");
            return;
        }

        // Prepare the data to send
        const newClass = {
            title: courseTitle,
            description: courseDesc,
            schedule: courseSched,
            method: courseMeth,
            subjectArea: courseSubject,
            credits: courseCredits
        };

        // Call createNewClass function with form data
        await createNewClass(teacherId, newClass);

        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("addCourseModal"));
        modal.hide(); // Hide the modal after submission

        // Optionally, you can reload the courses list to reflect the new course
        getClass(); // Re-fetch the courses list
    });
};


// Logout functionality
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userType");
    window.location.href = "index.html"; // Redirect to homepage
}

let data = {}; // Declare data globally to hold course info

// Function to fetch and display course list
async function getClass() {
    try {
        let response = await fetch("https://petalite-immediate-vase.glitch.me/register"); // Fetch course data from API
        if (!response.ok) throw new Error("Failed to fetch class data");
        
        data = await response.json(); // Store the course data

        const coursesContainer = document.getElementById("courses-container");

        if (data.classes && data.classes.length > 0) {
            // Clear previous content before adding new ones
            coursesContainer.innerHTML = ""; 

            // Loop through all courses dynamically and create HTML structure
            data.classes.forEach((course) => {
                const courseCard = document.createElement("div");
                courseCard.classList.add("row", "p-5", "gx-5", "position-relative");

                const cardCol1 = document.createElement("div");
                cardCol1.classList.add("col", "col-lg-2", "card");
                cardCol1.style.width = "18rem";

                const cardBody1 = document.createElement("div");
                cardBody1.classList.add("card-body");

                const courseTitle = document.createElement("h5");
                courseTitle.classList.add("card-title");
                courseTitle.innerText = course.title || "No title available";

                const courseDesc = document.createElement("p");
                courseDesc.classList.add("card-text");
                courseDesc.innerText = course.description || "No description available";

                const viewButton = document.createElement("a");
                viewButton.href = "#";
                viewButton.classList.add("btn", "btn-primary");
                viewButton.innerText = "View";
                viewButton.onclick = function() {
                    viewCourse(course._id); // Pass the MongoDB _id to viewCourse function
                };

                cardBody1.appendChild(courseTitle);
                cardBody1.appendChild(courseDesc);
                cardBody1.appendChild(viewButton);
                cardCol1.appendChild(cardBody1);

                const cardCol2 = document.createElement("div");
                cardCol2.classList.add("col", "d-none", "d-lg-block");

                const courseInst = document.createElement("h5");
                courseInst.innerText = "Instructor";

                const instText = document.createElement("p");
                instText.innerText = course.instructor || "Instructor not available";

                const courseSched = document.createElement("h5");
                courseSched.innerText = "Schedule";

                const schedText = document.createElement("p");
                schedText.innerText = course.schedule || "Schedule not available";

                const courseMeth = document.createElement("h5");
                courseMeth.innerText = "Method";

                const methText = document.createElement("p");
                methText.innerText = course.method || "Method not available";

                cardCol2.appendChild(courseInst);
                cardCol2.appendChild(instText);
                cardCol2.appendChild(courseSched);
                cardCol2.appendChild(schedText);
                cardCol2.appendChild(courseMeth);
                cardCol2.appendChild(methText);

                courseCard.appendChild(cardCol1);
                courseCard.appendChild(cardCol2);

                coursesContainer.appendChild(courseCard); // Add the course card to the container
            });
        }
    } catch (error) {
        console.error("Error fetching class data:", error);
    }
}

// Function to handle course details view
function viewCourse(courseId) {
    const courseData = data.classes.find(course => course._id === courseId); // Find course by ID

    if (courseData) {
        localStorage.setItem("course", JSON.stringify(courseData)); // Store course in localStorage
        window.location.href = `courseTeacherView.html?id=${courseData._id}`; // Redirect to course details page
    } else {
        console.error("Course not found.");
    }
}


async function createNewClass(teacherId, newClass) {
    const token = localStorage.getItem("token");

    if (!teacherId || !newClass) {
        console.error("Missing teacherId or class data");
        return;
    }

    try {
        const response = await fetch(`https://petalite-immediate-vase.glitch.me/api/teachers/${teacherId}/classes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newClass)
        });

        const rawResponse = await response.text();
        console.log("Raw response:", rawResponse);

        if (response.ok) {
            const data = JSON.parse(rawResponse);
            console.log("Class created successfully:", data);
        } else {
            console.error("Error creating class:", rawResponse);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
