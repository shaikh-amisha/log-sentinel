
const INCIDENTS_API =
    "http://localhost:5000/api/alerts";

const INCIDENT_REPORT_API =
    "http://localhost:5000/api/incidents/report";

let allIncidents = [];


// =========================
// LOAD INCIDENTS
// =========================

const loadIncidents = async () => {

    try {

        const response =
            await fetch(INCIDENTS_API);

        const data =
            await response.json();

        console.log(data);

        allIncidents =
            data.alerts;

        renderIncidents(
            allIncidents
        );

    } catch (error) {

        console.error(error);

    }

};


// =========================
// RENDER INCIDENTS
// =========================

const renderIncidents = (incidents) => {

    const tableBody =
        document.getElementById(
            "incidents-table-body"
        );

    tableBody.innerHTML = "";

    incidents.forEach((incident, index) => {

        tableBody.innerHTML += `

            <tr>

                <td>

                    INC-00${index + 1}

                </td>

                <td>

                    ${incident.alert_type}

                </td>

                <td>

                    <span class="badge
                        ${incident.severity === "critical"
                            ? "bg-danger"
                            : incident.severity === "high"
                            ? "bg-warning text-dark"
                            : "bg-info text-dark"}">

                        ${incident.severity}

                    </span>

                </td>

                <td>

                    <span class="badge
                        ${incident.status === "resolved"
                            ? "bg-success"
                            : incident.status === "investigating"
                            ? "bg-warning text-dark"
                            : "bg-danger"}">

                        ${incident.status}

                    </span>

                </td>

                <td>

                    ${incident.mitre_technique}

                </td>

                <td>

                    ${new Date(
                        incident.generatedAt
                    ).toLocaleString()}

                </td>

                <td>

                    <button
                        class="btn btn-outline-info btn-sm"

                        onclick='viewIncidentReport(
                            ${JSON.stringify(incident)}
                        )'>

                        View Report

                    </button>

                </td>

            </tr>

        `;

    });

};


// =========================
// VIEW INCIDENT REPORT
// =========================

const viewIncidentReport =
async (incident) => {

    const reportContainer =
        document.getElementById(
            "incident-report-content"
        );

    // Loading
    reportContainer.innerHTML = `

        <div class="text-info">

            Generating AI incident report...

        </div>

    `;


    // Open modal immediately
    const modal =
        new bootstrap.Modal(

            document.getElementById(
                "incidentModal"
            )

        );

    modal.show();


    try {

        const response =
            await fetch(
                INCIDENT_REPORT_API,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify(
                        incident
                    )

                }
            );

        const data =
            await response.json();

        reportContainer.innerHTML = `

            <div class="ai-report"
                 style="white-space: pre-wrap;">

                ${data.report}

            </div>

        `;

    } catch (error) {

        console.error(error);

        reportContainer.innerHTML = `

            <div class="text-danger">

                Failed to generate incident report.

            </div>

        `;

    }

};


// =========================
// INITIAL LOAD
// =========================

loadIncidents();