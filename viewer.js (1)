
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

    const matches = [];
    snapshot.forEach(childSnapshot => {
        const match = { key: childSnapshot.key, ...childSnapshot.val() };
        matches.push(match);
    });

    // Sort matches by IDP time
    matches.sort((a, b) => a.startTime.localeCompare(b.startTime));

    matches.forEach(match => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${match.idp}</td>
            <td>${match.startTime}</td>
            <td>${match.maps.map(map => map[0]).join("+")}</td> <!-- Shortened Maps -->
            <td>${match.qualify}</td>
            <td><button class="details-btn" data-key="${match.key}">🔽</button></td>
        `;
        tableBody.appendChild(row);

        // Hidden row for full details
        const detailsRow = document.createElement("tr");
        detailsRow.classList.add("details-row");
        detailsRow.style.display = "none";
        detailsRow.innerHTML = `
            <td colspan="5">
                <div class="match-details">
                    <p><strong>IDP:</strong> ${match.idp}</p>
                    <p><strong>START:</strong> ${match.startTime}</p>
                    <p><strong>MAPS:</strong> ${match.maps.join(", ")}</p>
                    <p><strong>INFO:</strong>${match.info || "no info"}</p>
                    <p><strong>QUALIFY:</strong> TOP ${match.qualify}</p>
                   
                    ${match.resultImage ? `<img onclick="download(this)" src="data:image/jpeg;base64,${match.resultImage}" style="max-width:75vw;">` : "Result Not Published"}
                
                    
                </div>
            </td>
        `;
        tableBody.appendChild(detailsRow);
    });

    // Add event listeners to expand/collapse details
    document.querySelectorAll(".details-btn").forEach(button => {
        button.addEventListener("click", () => {
            const key = button.dataset.key;
            const detailsRow = button.closest("tr").nextElementSibling;
            detailsRow.style.display = detailsRow.style.display === "none" ? "table-row" : "none";
            button.textContent = detailsRow.style.display === "none" ? "🔽" : "🔼";
        });
    });
});

// Search Filter
document.getElementById("search").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    document.querySelectorAll("#match-list tr").forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
});
