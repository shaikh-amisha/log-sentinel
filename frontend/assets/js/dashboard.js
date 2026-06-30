// =========================
// API BASE URL
// =========================

const API_BASE =
    "http://localhost:5000/api/dashboard";

const ALERT_VOLUME_API =
  "http://localhost:5000/api/dashboard/alert-volume";


// =========================
// LOAD DASHBOARD STATS
// =========================

const loadDashboardStats = async () => {

    try {

        const response =
            await fetch(`${API_BASE}/stats`);

        const data =
            await response.json();

        const stats =
            data.stats;

        // Update Cards
        document.getElementById(
            "total-alerts"
        ).innerText =
            stats.totalAlerts;

        document.getElementById(
            "critical-alerts"
        ).innerText =
            stats.criticalAlerts;

        document.getElementById(
            "resolved-alerts"
        ).innerText =
            stats.resolvedAlerts;

        document.getElementById(
            "high-alerts"
        ).innerText =
            stats.highAlerts;

    } catch (error) {

        console.error(error);

    }

};


// =========================
// LOAD SEVERITY CHART
// =========================

const loadSeverityChart = async () => {

    try {

        const response =
            await fetch(`${API_BASE}/severity`);

        const data =
            await response.json();

        const chartData =
            data.chartData;

        const ctx =
            document.getElementById(
                "severityChart"
            );

        new Chart(ctx, {

            type: "doughnut",

            data: {

                labels: [
                    "Low",
                    "Medium",
                    "High",
                    "Critical"
                ],

                datasets: [{

                    data: [

                        chartData.low,

                        chartData.medium,

                        chartData.high,

                        chartData.critical

                    ],

                    backgroundColor: [

                        "#3b82f6",

                        "#eab308",

                        "#f97316",

                        "#ef4444"

                    ],

                    borderWidth: 0

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        labels: {

                            color: "#e5e7eb"

                        }

                    }

                }

            }

        });

    } catch (error) {

        console.error(error);

    }

};


// =========================
// LOAD MITRE HEATMAP
// =========================

const loadMitreHeatmap = async () => {

    try {

        const response =
            await fetch(`${API_BASE}/mitre`);

        const data =
            await response.json();

        const container =
            document.getElementById(
                "mitre-container"
            );

        container.innerHTML = "";

        data.mitreStats.forEach((item) => {

            const box = document.createElement("div");

            box.className =
                "col-md-3";

            box.innerHTML = `

                <div class="mitre-box">

                    <small>
                        ${item._id}
                    </small>

                    <h3>
                        ${item.count}
                    </h3>

                </div>

            `;

            container.appendChild(box);

        });

    } catch (error) {

        console.error(error);

    }

};


// =========================
// LOAD RECENT ALERTS
// =========================

const loadRecentAlerts = async () => {

    try {

        const response =
            await fetch(`${API_BASE}/recent`);

        const data =
            await response.json();

        const tableBody =
            document.getElementById(
                "alerts-table-body"
            );

        tableBody.innerHTML = "";

        data.alerts.forEach((alert) => {

            const row =
                document.createElement("tr");

        row.innerHTML = `

            <td>
                ${new Date(
                    alert.generatedAt
                ).toLocaleString()}
            </td>

            <td>
                ${alert.source_ip || "auth.log"}
            </td>

            <td>
                ${alert.alert_type}
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

                    ${alert.severity.toUpperCase()}

                </span>

            </td>

            <td>
                ${alert.mitre_technique}
            </td>

            <td>

                <span class="badge
                    ${alert.status === "open"
                        ? "bg-danger"
                        : alert.status === "investigating"
                        ? "bg-warning text-dark"
                        : "bg-success"}">

                    ${alert.status.toUpperCase()}

                </span>

            </td>

        `;
            tableBody.appendChild(row);

        });

    } catch (error) {

        console.error(error);

    }

};

let alertChart;

async function loadAlertVolume() {

  try {

    const response =
      await fetch(
        ALERT_VOLUME_API
      );

    const data =
      await response.json();

    if (!data.success) {
      return;
    }

    renderAlertVolumeChart(
      data.labels,
      data.values
    );

  } catch (err) {

    console.error(
      "ALERT VOLUME ERROR",
      err
    );
  }
}

function renderAlertVolumeChart(labels, values) {
    const ctx = document.getElementById("alertVolumeChart").getContext("2d");

    if (alertChart) alertChart.destroy();

    alertChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Alerts",
                data: values,
                borderColor: "#38bdf8",
                backgroundColor: "rgba(56,189,248,0.1)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#38bdf8",
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: "#e5e7eb" } }
            },
            scales: {
                x: {
                    ticks: { color: "#9ca3af" },
                    grid: { color: "#1f2937" }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: "#9ca3af" },
                    grid: { color: "#1f2937" }
                }
            }
        }
    });
}

// =========================
// INITIALIZE DASHBOARD
// =========================

loadDashboardStats();

loadSeverityChart();

loadMitreHeatmap();

loadRecentAlerts();

loadAlertVolume();


