window.onload = function () {
    getClass();
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


let data = {}; // Declare data globally

async function getClass() {
    try {
        let response = await fetch("https://petalite-immediate-vase.glitch.me/register");
        if (!response.ok) throw new Error("Failed to fetch class data");
        
        data = await response.json();

        const coursesContainer = document.getElementById("courses-container");

        if (data.classes && data.classes.length > 0) {
            // Clear previous content before adding new ones (if needed)
            coursesContainer.innerHTML = ""; // Optional: clear content if you want to reset

            // Loop through all courses dynamically
            data.classes.forEach((course) => {
                // Create new course card
                const courseCard = document.createElement("div");
                courseCard.classList.add("row", "p-5", "gx-5", "position-relative");

                // Create the course card body
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
                    viewCourse(course._id); // Pass the MongoDB _id to the viewCourse function
                };

                cardBody1.appendChild(courseTitle);
                cardBody1.appendChild(courseDesc);
                cardBody1.appendChild(viewButton);
                cardCol1.appendChild(cardBody1);

                // Create the details column
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

                // Append both columns (card and details) to the main row
                courseCard.appendChild(cardCol1);
                courseCard.appendChild(cardCol2);

                // Append the new course card to the container
                coursesContainer.appendChild(courseCard);
            });
        }
    } catch (error) {
        console.error("Error fetching class data:", error);
    }
}

function viewCourse(courseId) {
    // Fetch the course data from the global 'data' array using the course's _id
    const courseData = data.classes.find(course => course._id === courseId); // Find the course by its _id

    if (courseData) {
        // Store the course data in localStorage to persist it
        localStorage.setItem("course", JSON.stringify(courseData));

        // Redirect to the course details page, passing the course's _id as a query parameter
        window.location.href = `courseView.html?id=${courseData._id}`; // Use backticks to inject courseId into the URL
    } else {
        console.error("Course not found.");
    }
}