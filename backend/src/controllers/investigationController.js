import LogEntry from "../models/LogEntry.js";
import Alert from "../models/Alert.js";

export const getInvestigationData = async (req, res) => {
    try {

        const logs = await LogEntry.find()
            .sort({ createdAt: -1 })
            .limit(100);

        const alerts = await Alert.find()
            .sort({ createdAt: -1 })
            .limit(50);

        const suspiciousIPs =
            [...new Set(
                logs
                    .map(log => log.sourceIp)
                    .filter(ip => ip && ip !== "-")
            )];

        const mitreTechniques =
            [...new Set(
                logs
                    .map(log => log.mitre)
                    .filter(m => m && m !== "-")
            )];

        const criticalCount =
            logs.filter(
                log =>
                    log.severity?.toLowerCase() ===
                    "critical"
            ).length;

        res.json({
            success: true,
            logs,
            alerts,
            suspiciousIPs,
            mitreTechniques,
            criticalCount
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message:
                "Failed to load investigation data."
        });

    }
};