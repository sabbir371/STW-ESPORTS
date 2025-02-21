import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getDatabase, ref, push, set, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBT7PeiOykAGhDnu_sYKzX_PdNevLL8eEM",
    authDomain: "stw-esports.firebaseapp.com",
    databaseURL: "https://stw-esports-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "stw-esports",
    storageBucket: "stw-esports.appspot.com",
    messagingSenderId: "4481094843",
    appId: "1:4481094843:web:7599bdb1d0e80f7be7859e",
    measurementId: "G-ZGR0ZV8DQR"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);
const matchesRef = ref(db, "matches");
console.log(storage)
// Unlock Admin Panel
document.getElementById("unlock-btn").addEventListener("click", () => {
    const passwordInput = document.getElementById("password-input").value;
    if (passwordInput === "fuso") {
        document.getElementById("password-container").style.display = "none";
        document.getElementById("admin-panel").style.display = "block";
    } else {
        alert("Incorrect Password!");
    }
});






document.getElementById("matchResult").addEventListener("change", function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const base64String = e.target.result.split(",")[1]; // Extract Base64 part
            

            // Store Base64 string in an input field for Firebase storage
            document.getElementById("matchResultBase64").value = base64String;
        };

        reader.readAsDataURL(file); // Convert to Base64
    }
});




// Add or Update Match
document.getElementById("add-match-btn").addEventListener("click", async () => {
    const idp = document.getElementById("idp").value;
    const startTime = document.getElementById("start-time").value;
    const maps = Array.from(document.getElementById("map-select").selectedOptions).map(opt => opt.value);
    const qualify = document.getElementById("qualify").value;
    const file = document.getElementById("matchResult").files[0];
    const matchResultBase64 = document.getElementById("matchResultBase64").value;
    const info = document.getElementById("info").value; 
    const matchKey = document.getElementById("add-match-btn").dataset.key || null;
    
    if (idp && startTime && maps.length > 0 && qualify) {
        
        

        const matchData = { idp, startTime,info, maps, qualify, resultImage: matchResultBase64 };

        if (matchKey) {
            // Update Match
            update(ref(db, `matches/${matchKey}`), matchData);
            document.getElementById("add-match-btn").textContent = "Add Match";
            document.getElementById("add-match-btn").removeAttribute("data-key");
            document.getElementById("add-match-btn").removeAttribute("data-image");
        } else {
            // Add New Match
            const newMatchRef = push(matchesRef);
            set(newMatchRef, matchData);
        }

        // Clear input fields
        document.getElementById("idp").value = "";
        document.getElementById("start-time").value = "";
        document.getElementById("map-select").value = "";
        document.getElementById("qualify").value = "";
        document.getElementById("info").value=""; 
        document.getElementById("matchResult").value = "";
   }  else {
        alert("Please fill all fields!");
    }
});

// Load Matches in Admin Panel
onValue(matchesRef, (snapshot) => {
    const tableBody = document.getElementById("match-list");
    tableBody.innerHTML = "";

    snapshot.forEach(childSnapshot => {
        const match = { key: childSnapshot.key, ...childSnapshot.val() };

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${match.idp}</td>
            <td>${match.startTime}</td>
            <td>${match.maps.join(", ")}</td>
            <td>${match.qualify}</td>
            <td> ${match.resultImage ? `<img src="data:image/jpeg;base64,${match.resultImage}" style="max-width:50px;">` : "No Image"}
            </td>
            <td>
                <button class="edit-btn" data-key="${match.key}" data-idp="${match.idp}" data-start="${match.startTime}" 
                        data-maps="${match.maps.join(",")}" data-qualify="${match.qualify}" data-info="${match.info || ''}" data-image="${match.resultImage || ""}">Edit</button>
                <button class="delete-btn" data-key="${match.key}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listeners for edit and delete
    document.querySelectorAll(".edit-btn").forEach(button => {
        button.addEventListener("click", () => {
            document.getElementById("idp").value = button.dataset.idp;
            document.getElementById("start-time").value = button.dataset.start;
            document.getElementById("map-select").value = button.dataset.maps.split(",");
            document.getElementById("qualify").value = button.dataset.qualify;
            document.getElementById("info").value = button.dataset.info;
            document.getElementById("add-match-btn").textContent = "Update Match";
            document.getElementById("add-match-btn").setAttribute("data-key", button.dataset.key);
            document.getElementById("add-match-btn").setAttribute("data-image", button.dataset.image);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", () => {
            const key = button.dataset.key;
            remove(ref(db, `matches/${key}`));
        });
    });
});
