import Alert from "../models/Alert.js";


// =========================
// DASHBOARD STATS
// =========================

export const getDashboardStats = async (req, res) => {

    try {

        const totalAlerts =
            await Alert.countDocuments();

        const criticalAlerts =
            await Alert.countDocuments({

                severity: "critical"

            });

        const highAlerts =
            await Alert.countDocuments({

                severity: "high"

            });

        const resolvedAlerts =
            await Alert.countDocuments({

                status: "resolved"

            });

        res.status(200).json({

            success: true,

            stats: {

                totalAlerts,

                criticalAlerts,

                highAlerts,

                resolvedAlerts

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =========================
// SEVERITY CHART
// =========================

export const getSeverityChart = async (req, res) => {

    try {

        const low =
            await Alert.countDocuments({
                severity: "low"
            });

        const medium =
            await Alert.countDocuments({
                severity: "medium"
            });

        const high =
            await Alert.countDocuments({
                severity: "high"
            });

        const critical =
            await Alert.countDocuments({
                severity: "critical"
            });

        res.status(200).json({

            success: true,

            chartData: {

                low,

                medium,

                high,

                critical

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =========================
// MITRE HEATMAP
// =========================

export const getMitreHeatmap = async (req, res) => {

    try {

        const mitreStats =
            await Alert.aggregate([

                {

                    $group: {

                        _id:
                            "$mitre_technique",

                        count: {

                            $sum: 1

                        }

                    }

                }

            ]);

        res.status(200).json({

            success: true,

            mitreStats

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// =========================
// RECENT ALERTS
// =========================

export const getRecentAlerts = async (req, res) => {

    try {

        const alerts =
            await Alert.find()
                .sort({ generatedAt: -1 })
                .limit(10);

        res.status(200).json({

            success: true,

            alerts

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Alert Volume

export const getAlertVolume = async (req, res) => {
  try {
    const alerts = await Alert.find();

    const hourlyCounts = {};

    alerts.forEach((alert) => {
      const date = new Date(
        alert.createdAt || Date.now()
      );

      const hour =
        date.getHours().toString().padStart(2, "0");

      hourlyCounts[hour] =
        (hourlyCounts[hour] || 0) + 1;
    });

    const labels = [];
    const values = [];

    for (let i = 0; i < 24; i++) {
      const hour =
        i.toString().padStart(2, "0");

      labels.push(`${hour}:00`);
      values.push(hourlyCounts[hour] || 0);
    }

    res.json({
      success: true,
      labels,
      values
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch alert volume"
    });
  }
};