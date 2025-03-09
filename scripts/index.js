window.onload = function () {
    serveData();
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
    if (localStorage.getItem("userType") === "student") {
        document.getElementById("schedule-link").style.display = "block";
    }
};

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("userType");

    window.location.href = "index.html"; // Redirect to home page after logout
}

async function serveData(){
    let response = await fetch("https://petalite-immediate-vase.glitch.me/register")
    let data = await response.json()
    //grabbing the places for the classes from the html
    let trendClass1 = document.getElementById('trendClass1')
    let trendClass1Desc = document.getElementById('trendClass1Desc')
    let trendClass2 = document.getElementById('trendClass2')
    let trendClass2Desc = document.getElementById('trendClass2Desc')
    let trendClass3 = document.getElementById('trendClass3')
    let trendClass3Desc = document.getElementById('trendClass3Desc')
    let trendClass4 = document.getElementById('trendClass4')
    let trendClass4Desc = document.getElementById('trendClass4Desc')
    let trendClass5 = document.getElementById('trendClass5')
    let trendClass5Desc = document.getElementById('trendClass5Desc')
    let trendClass6 = document.getElementById('trendClass6')
    let trendClass6Desc = document.getElementById('trendClass6Desc')
    let trendClass7 = document.getElementById('trendClass7')
    let trendClass7Desc = document.getElementById('trendClass7Desc')
    let trendClass8 = document.getElementById('trendClass8')
    let trendClass8Desc = document.getElementById('trendClass8Desc')
    let trendClass9 = document.getElementById('trendClass9')
    let trendClass9Desc = document.getElementById('trendClass9Desc')
    //putting the classes information to the html
    trendClass1.innerText = data.classes[0].title
    trendClass1Desc.innerText = data.classes[0].description
    trendClass2.innerText = data.classes[1].title
    trendClass2Desc.innerText = data.classes[1].description
    trendClass3.innerText = data.classes[2].title
    trendClass3Desc.innerText = data.classes[2].description
    trendClass4.innerText = data.classes[3].title
    trendClass4Desc.innerText = data.classes[3].description
    trendClass5.innerText = data.classes[4].title
    trendClass5Desc.innerText = data.classes[4].description
    trendClass6.innerText = data.classes[5].title
    trendClass6Desc.innerText = data.classes[5].description
    trendClass7.innerText = data.classes[6].title
    trendClass7Desc.innerText = data.classes[6].description
    trendClass8.innerText = data.classes[7].title
    trendClass8Desc.innerText = data.classes[7].description
    trendClass9.innerText = data.classes[8].title
    trendClass9Desc.innerText = data.classes[8].description
}
