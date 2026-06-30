console.log("Alerts page loaded");

const ALERTS_API =
    "http://localhost:5000/api/alerts";

let allAlerts = [];


// =========================
// LOAD ALERTS
// =========================

const loadAlerts = async () => {

    try {

        const response =
            await fetch(ALERTS_API);

        const data =
            await response.json();

        allAlerts =
            data.alerts;

        console.log(data);

        // Populate source dropdown
        populateSourceFilter();

        // Initial render
        renderAlerts(allAlerts);

    } catch (error) {

        console.error(error);

    }

};


// =========================
// RENDER ALERTS
// =========================

const renderAlerts = (alerts) => {

    const tableBody =
        document.getElementById(
            "alerts-table-body"
        );

    tableBody.innerHTML = "";

    if (alerts.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td colspan="8"
                    class="text-center text-secondary">

                    No alerts found.

                </td>

            </tr>

        `;

        return;

    }

    alerts.forEach(alert => {

        tableBody.innerHTML += `

            <tr>

                <td>

                    ${new Date(
                        alert.generatedAt
                    ).toLocaleString()}

                </td>

                <td>

                    ${alert.source_ip || "-"}

                </td>

                <td>

                    ${alert.alert_type || "-"}

                </td>

                <td>

                    <span class="badge
                        ${alert.severity === "critical"
                            ? "bg-danger"
                            : alert.severity === "high"
                            ? "bg-warning text-dark"
                            : alert.severity === "medium"
                            ? "bg-info text-dark"
                            : "bg-primary"}">

                        ${alert.severity}

                    </span>

                </td>

                <td>

                    ${alert.mitre_technique || "-"}

                </td>

                <td>

                    <span class="badge
                        ${alert.status === "resolved"
                            ? "bg-success"
                            : alert.status === "investigating"
                            ? "bg-warning text-dark"
                            : "bg-danger"}">

                        ${alert.status}

                    </span>

                </td>

                <td>

                    ${alert.confidence}%

                </td>

                <td>

                    <button
                        class="btn btn-outline-info btn-sm">

                        View

                    </button>

                </td>

            </tr>

        `;

    });

};


// =========================
// POPULATE SOURCE FILTER
// =========================

const populateSourceFilter = () => {

    const sourceFilter =
        document.getElementById(
            "source-filter"
        );

    const uniqueSources =
        [...new Set(

            allAlerts.map(
                alert => alert.source_ip
            )

        )];

    sourceFilter.innerHTML = `

        <option value="">
            All Sources
        </option>

    `;

    uniqueSources.forEach(source => {

        if (!source) return;

        sourceFilter.innerHTML += `

            <option value="${source}">

                ${source}

            </option>

        `;

    });

};


// =========================
// FILTER ALERTS
// =========================

const applyFilters = () => {

    const severity =
        document.getElementById(
            "severity-filter"
        ).value;

    const source =
        document.getElementById(
            "source-filter"
        ).value;

    const status =
        document.getElementById(
            "status-filter"
        ).value;

    const search =
        document.getElementById(
            "search-filter"
        ).value.toLowerCase();

    let filtered =
        [...allAlerts];


    // =========================
    // SEVERITY FILTER
    // =========================

    if (severity) {

        filtered =
            filtered.filter(alert =>

                alert.severity
                        ?.toLowerCase() ===
                    severity.toLowerCase()

            );

    }


    // =========================
    // SOURCE FILTER
    // =========================

    if (source) {

        filtered =
            filtered.filter(alert =>

                alert.source_ip === source

            );

    }


    // =========================
    // STATUS FILTER
    // =========================

    if (status) {

        filtered =
            filtered.filter(alert =>

               alert.status?.toLowerCase() ===
                status.toLowerCase()
            );

    }


    // =========================
    // SEARCH FILTER
    // =========================

    if (search) {

        filtered =
            filtered.filter(alert =>

                alert.alert_type
                    ?.toLowerCase()
                    .includes(search)

            );

    }


    // =========================
    // RENDER FILTERED RESULTS
    // =========================

    renderAlerts(filtered);

};


// =========================
// FILTER EVENTS
// =========================

document
    .getElementById(
        "severity-filter"
    )
    .addEventListener(
        "change",
        applyFilters
    );

document
    .getElementById(
        "source-filter"
    )
    .addEventListener(
        "change",
        applyFilters
    );

document
    .getElementById(
        "status-filter"
    )
    .addEventListener(
        "change",
        applyFilters
    );

document
    .getElementById(
        "search-filter"
    )
    .addEventListener(
        "input",
        applyFilters
    );


// =========================
// EXPORT ALERTS CSV
// =========================

const exportAlertsCSV = () => {

    if (allAlerts.length === 0) {

        alert(
            "No alerts available to export."
        );

        return;

    }

    // CSV HEADERS
    let csvContent =

`Timestamp,Source IP,Threat,Severity,MITRE,Status,Confidence\n`;


    // CSV ROWS
    allAlerts.forEach(alert => {

        csvContent +=

`${new Date(alert.generatedAt).toLocaleString()},
${alert.source_ip || "-"},
${alert.alert_type || "-"},
${alert.severity || "-"},
${alert.mitre_technique || "-"},
${alert.status || "-"},
${alert.confidence || "-"}%\n`;

    });


    // CREATE FILE
    const blob =
        new Blob(
            [csvContent],
            {
                type: "text/csv"
            }
        );

    const url =
        window.URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href =
        url;

    link.download =
        "alerts.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

};


// =========================
// EXPORT BUTTON
// =========================

document
    .getElementById(
        "export-alerts-btn"
    )
    .addEventListener(
        "click",
        exportAlertsCSV
    );

    

// =========================
// INITIAL LOAD
// =========================

loadAlerts();