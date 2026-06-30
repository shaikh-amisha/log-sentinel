const API_URL =
    "http://localhost:5000/api/logs/upload";

document
    .getElementById("analyze-btn")
    .addEventListener("click", async () => {

        try {

            const fileInput =
                document.getElementById("logFile");

            const file =
                fileInput.files[0];

            if (!file) {
                alert("Please select a log file");
                return;
            }

            const analysisContainer =
                document.getElementById(
                    "ai-analysis-content"
                );

            analysisContainer.innerHTML = `
                <div class="text-info">
                    Analyzing security telemetry...
                </div>
            `;



            const formData =
                new FormData();

            formData.append(
                "logFile",
                file
            );

            const response =
                await fetch(API_URL, {
                    method: "POST",
                    body: formData
                });

            const data =
                await response.json();

            console.log(
                "FRONTEND DATA:",
                data
            );

            let aiText =
                data.aiAnalysis ||
                data.response ||
                "No AI analysis generated.";

            analysisContainer.innerHTML = `
                <div class="mb-3">
                    <span class="badge bg-danger">
                        Analysis Complete
                    </span>
                </div>
            `;

            const report =
                document.createElement("div");

            report.className =
                "ai-report";

            report.style.whiteSpace =
                "pre-wrap";

            report.textContent =
                aiText;

            analysisContainer.appendChild(
                report
            );

            // =========================
            // RENDER PARSED EVENTS
            // =========================

            const tableBody =
                document.getElementById(
                    "parsed-events-body"
                );

            tableBody.innerHTML = "";
            console.log("Rendering Events");
          console.log("parsedEvents:", data.parsedEvents);
            console.log("tableBody el:", document.getElementById("parsed-events-body"));
            console.log("Is array:", Array.isArray(data.parsedEvents));
            console.log("Length:", data.parsedEvents?.length);


            data.parsedEvents.forEach(event => {

                const severity =
                    (event.severity || "Low")
                    .toLowerCase();

                let badgeClass =
                    "bg-primary";

                if (severity === "critical") {
                    badgeClass = "bg-danger";
                }
                else if (severity === "high") {
                    badgeClass =
                        "bg-warning text-dark";
                }
                else if (severity === "medium") {
                    badgeClass =
                        "bg-info text-dark";
                }

                tableBody.innerHTML += `
                    <tr>
                        <td>${event.timestamp || "-"}</td>
                        <td>${event.eventType || "-"}</td>
                        <td>${event.ip || "-"}</td>
                        <td>${event.user || "-"}</td>

                        <td>
                            <span class="badge ${badgeClass}">
                                ${event.severity || "Low"}
                            </span>
                        </td>

                        <td>${event.message || "-"}</td>
                    </tr>
                `;
            });

            // =========================
            // SUSPICIOUS IPS
            // =========================

            const ipContainer =
                document.getElementById(
                    "suspicious-ip-list"
                );

            ipContainer.innerHTML = "";

            const uniqueIPs =
                [...new Set(

                    data.parsedEvents
                        .map(event => event.ip)
                        .filter(ip =>
                            ip &&
                            ip !== "-" &&
                            ip !== "localhost"
                        )

                )];

            if (uniqueIPs.length === 0) {

                ipContainer.innerHTML = `
                    <p class="text-secondary">
                        No suspicious IPs detected.
                    </p>
                `;

            } else {

                uniqueIPs.forEach(ip => {

                    ipContainer.innerHTML += `
                        <div class="ioc-item mb-2">
                            ${ip}
                        </div>
                    `;

                });

            }

            // =========================
            // FAILED LOGIN COUNT
            // =========================

            const failedLogins =
                data.parsedEvents.filter(
                    event =>
                        event.eventType
                            ?.toLowerCase()
                            .includes("failed")
                ).length;

            document.getElementById(
                "failed-login-count"
            ).textContent =
                failedLogins;

            // =========================
            // EVENT COUNT
            // =========================

            const eventCountBadge =
                document.getElementById(
                    "event-count"
                );

            if (eventCountBadge) {

                eventCountBadge.textContent =
                    `${data.parsedEvents.length} Events Parsed`;

            }

        } catch (error) {

            console.error(
                "FRONTEND ERROR:",
                error
            );

            document.getElementById(
                "ai-analysis-content"
            ).innerHTML = `
                <div class="text-danger">
                    AI analysis failed.
                </div>
            `;
        }

    });