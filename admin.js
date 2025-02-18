import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBT7PeiOykAGhDnu_sYKzX_PdNevLL8eEM",
    authDomain: "stw-esports.firebaseapp.com",
    databaseURL: "https://stw-esports-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "stw-esports",
    storageBucket: "stw-esports.firebasestorage.app",
    messagingSenderId: "4481094843",
    appId: "1:4481094843:web:7599bdb1d0e80f7be7859e",
    measurementId: "G-ZGR0ZV8DQR"
    
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const matchesRef = ref(db, "matches");

// Password Protection
document.getElementById("password-container").querySelector("button").addEventListener("click", () => {
    const password = document.getElementById("password-input").value;
    if (password === "fuso") {
        document.getElementById("password-container").style.display = "none";
        document.getElementById("admin-panel").style.display = "block";
    } else {
        alert("Incorrect Password");
    }
});

// Add Match
document.querySelector(".addmatch").addEventListener("click", () => {
    const idp = document.getElementById("idp").value;
    const startTime = document.getElementById("start-time").value;
    const date = document.getElementById("date").value;
    const qualify = document.getElementById("qualify").value;

    if (idp && startTime && date && qualify) {
        const newMatchRef = push(matchesRef);
        set(newMatchRef, { idp, startTime, date, qualify });
    } else {
        alert("Please fill all fields!");
    }
});

// Display Matches
onValue(matchesRef, (snapshot) => {
    const tableBody = document.getElementById("match-list");
    tableBody.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
        const match = childSnapshot.val();
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${match.idp}</td>
            <td>${match.startTime}</td>
            <td>${match.date}</td>
            <td>${match.qualify}</td>
            <td><button class="delete-btn" data-key="${childSnapshot.key}">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });

    // Delete Match
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", () => {
            remove(ref(db, `matches/${button.dataset.key}`));
        });
    });
});