console.log("ZeroLeak JavaScript Loaded");


// ==========================================
// FILE UPLOAD
// ==========================================

const fileInput = document.getElementById("fileInput");
const codeInput = document.getElementById("codeInput");
const selectedFile = document.getElementById("selectedFile");


fileInput.addEventListener("change", function () {

    const file = fileInput.files[0];

    if (!file) {
        selectedFile.textContent = "No file selected";
        return;
    }

    selectedFile.textContent = "Selected: " + file.name;

    const reader = new FileReader();

    reader.onload = function (event) {

        codeInput.value = event.target.result;

    };

    reader.onerror = function () {

        alert("Unable to read the selected file.");

    };

    reader.readAsText(file);

});


// ==========================================
// SCAN CODE
// ==========================================

async function scanCode() {

    const resultsSection =
        document.getElementById("resultsSection");

    const findingsContainer =
        document.getElementById("findingsContainer");

    const code = codeInput.value;


    if (code.trim() === "") {

        alert("Please paste some source code or upload a file first.");

        return;
    }


    const scanButton =
        document.getElementById("scanButton");

    scanButton.disabled = true;
    scanButton.textContent = "⏳ Scanning...";


    try {

        const response = await fetch("/scan", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                code: code
            })

        });


        if (!response.ok) {

            throw new Error(
                "Server error: " + response.status
            );

        }


        const result = await response.json();

        console.log("Scan Result:", result);


        // Show results section

        resultsSection.classList.remove("hidden");

        findingsContainer.innerHTML = "";


        // ==========================================
        // DASHBOARD
        // ==========================================

        document.getElementById("filesScanned")
            .textContent = "1";


        document.getElementById("secretsFound")
            .textContent = result.count;


        document.getElementById("securityScore")
            .textContent = result.score;


        document.getElementById("resultScore")
            .textContent = result.score;


        // ==========================================
        // NO FINDINGS
        // ==========================================

        if (result.count === 0) {

            document.getElementById("resultTitle")
                .textContent = "No Secrets Detected";


            findingsContainer.innerHTML = `

                <div class="finding safe">

                    <div class="finding-title">
                        ✅ Code Looks Safe
                    </div>

                    <div class="finding-info">
                        ZeroLeak did not detect any obvious
                        hard-coded secrets in the submitted code.
                    </div>

                </div>

            `;

            return;
        }


        // ==========================================
        // FINDINGS DETECTED
        // ==========================================

        document.getElementById("resultTitle")
            .textContent = "Security Issues Detected";


        result.findings.forEach(function (finding) {

            const div =
                document.createElement("div");


            if (finding.severity === "MEDIUM") {

                div.className = "finding medium";

            } else {

                div.className = "finding";

            }


            div.innerHTML = `

                <div class="finding-title">

                    🔴 ${finding.type}
                    — ${finding.severity}

                </div>


                <div class="finding-info">

                    ${finding.message}

                    <br>

                    <strong>Line:</strong>
                    ${finding.line}

                    <br><br>

                    <strong>Recommendation:</strong>

                    Move sensitive values to environment
                    variables or a secure secret store.

                </div>

            `;


            findingsContainer.appendChild(div);

        });


    } catch (error) {

        console.error("ZeroLeak Error:", error);


        alert(
            "Unable to connect to ZeroLeak backend.\n\n" +
            "Make sure devops1.py is running."
        );


    } finally {

        scanButton.disabled = false;

        scanButton.textContent = "🔍 Scan Code";

    }

}


// ==========================================
// CLEAR
// ==========================================

function clearCode() {

    codeInput.value = "";

    fileInput.value = "";

    selectedFile.textContent = "No file selected";


    document.getElementById("resultsSection")
        .classList.add("hidden");


    document.getElementById("filesScanned")
        .textContent = "0";


    document.getElementById("secretsFound")
        .textContent = "0";


    document.getElementById("securityScore")
        .textContent = "--";


    document.getElementById("resultScore")
        .textContent = "100";


    document.getElementById("resultTitle")
        .textContent = "Analysis Complete";


    document.getElementById("findingsContainer")
        .innerHTML = "";

}