import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";

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
        `;
        tableBody.appendChild(row);
    });
});

// Search Filter
document.getElementById("search").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    document.querySelectorAll("#match-list tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
});
