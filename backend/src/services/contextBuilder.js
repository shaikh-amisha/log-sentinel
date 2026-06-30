import LogEntry from "../models/LogEntry.js";
import Alert from "../models/Alert.js";

export const buildContext = async (question) => {

    const logs = await LogEntry.find()
        .sort({ createdAt: -1 })
        .limit(20);

    const alerts = await Alert.find()
        .sort({ createdAt: -1 })
        .limit(10);

    const logSummary = logs.length > 0
        ? logs.map(log =>
            `- ${log.eventType} | IP: ${log.sourceIp} | User: ${log.username} | Severity: ${log.severity} | MITRE: ${log.mitre}`
        ).join("\n")
        : "No logs available.";

    const alertSummary = alerts.length > 0
        ? alerts.map(a =>
            `- ${a.alert_type} | IP: ${a.source_ip || "-"} | User: ${a.username || "-"} | Severity: ${a.severity} | MITRE: ${a.mitre_technique}`
        ).join("\n")
        : "No alerts available.";

    return `
User Question: ${question}

Recent Log Events:
${logSummary}

Recent Alerts:
${alertSummary}
`;
};