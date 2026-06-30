export const detectBruteForce = (events) => {
    const failedLogins = {};
    const alerts = [];

    for (const event of events) {
        if (event.eventType === "Failed Login") {
            const ip = event.ip;
            if (!failedLogins[ip]) failedLogins[ip] = 0;
            failedLogins[ip]++;
        }
    }

    for (const ip in failedLogins) {
        if (failedLogins[ip] >= 3) {
            alerts.push({
                alert_type: "SSH Brute Force",
                severity: "critical",
                source_ip: ip,
                mitre_technique: "T1110",
                confidence: 95,
                recommendation: "Block IP and investigate authentication activity"
            });
        }
    }

    return alerts;
};

export const detectPrivilegeEscalation = (events) => {
    const alerts = [];

    for (const event of events) {
        if (event.eventType === "Privilege Escalation") {
            alerts.push({
                alert_type: "Privilege Escalation",
                severity: "high",
                username: event.user,
                source_ip: event.ip || null,
                mitre_technique: "T1548",
                confidence: 90,
                recommendation: "Review sudo command execution"
            });
        }
    }

    return alerts;
};

export const detectCronPersistence = (events) => {
    const alerts = [];

    for (const event of events) {
        if (event.eventType === "Persistence") {
            const suspicious = event.message?.includes("/tmp");
            alerts.push({
                alert_type: suspicious
                    ? "Suspicious Cron Persistence"
                    : "Cron Activity",
                severity: suspicious ? "critical" : "medium",
                mitre_technique: "T1053",
                confidence: suspicious ? 96 : 70,
                recommendation: suspicious
                    ? "Investigate possible persistence mechanism"
                    : "Review scheduled task"
            });
        }
    }

    return alerts;
};

export const detectSuspiciousLogin = (events) => {
    const alerts = [];

    for (const event of events) {
        if (event.eventType === "SSH Login") {
            if (event.ip !== "192.168.1.10") {
                alerts.push({
                    alert_type: "Suspicious Successful Login",
                    severity: "high",
                    source_ip: event.ip,
                    username: event.user,
                    mitre_technique: "T1078",
                    confidence: 88,
                    recommendation: "Verify account activity and login origin"
                });
            }
        }
    }

    return alerts;
};