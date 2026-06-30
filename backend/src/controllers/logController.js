import UploadedLog from "../models/UploadedLog.js";
import Alert from "../models/Alert.js";
import { generateAIAnalysis } from "../services/ollamaService.js";
import LogEntry from "../models/LogEntry.js";
import {
    runAuthParser
} from "../services/parserService.js";

import{
  
    detectBruteForce,

    detectPrivilegeEscalation,

    detectCronPersistence,

    detectSuspiciousLogin

} from "../services/detectionService.js"


// =========================
// UPLOAD LOG FILE
// =========================

export const uploadLogFile = async (req, res) => {

    try {

        // Validate Upload
        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "No log file uploaded"

            });

        }


        // Detect Log Type
        let detectedType = "unknown";

        if (
            req.file.originalname.includes("auth")
        ) {

            detectedType = "auth.log";

        } else if (
            req.file.originalname.includes("syslog")
        ) {

            detectedType = "syslog";

        } else if (
            req.file.originalname.includes("audit")
        ) {

            detectedType = "audit.log";

        }


        // Save Upload Metadata
        const uploadedLog =
            await UploadedLog.create({

                originalName:
                    req.file.originalname,

                storedName:
                    req.file.filename,

                filePath:
                    req.file.path,

                fileSize:
                    req.file.size,

                logType:
                    detectedType

            });


        // =========================
        // RUN PYTHON PARSER
        // =========================

let parsedEvents = [];

if (detectedType === "auth.log") {

    parsedEvents =
        await runAuthParser(req.file.path);

        console.log(parsedEvents);

        for (const event of parsedEvents) {

            await LogEntry.create({

                timestamp:
                    event.timestamp || new Date(),

                message:
                    event.message || "",

                eventType:
                    event.eventType || "Unknown",

                severity:
                    event.severity || "Low",

                sourceIp:
                    event.ip || "-",

                username:
                    event.user || "-",

                host:
                    event.host || "-",

                mitre:
                    event.mitre || "-"

            });

        }

    }



            // =========================
            // RUN DETECTIONS
            // =========================
            const bruteForceAlerts =
                detectBruteForce(parsedEvents);

            const privilegeAlerts =
                detectPrivilegeEscalation(parsedEvents);

            const cronAlerts =
                detectCronPersistence(parsedEvents);

            const loginAlerts =
                detectSuspiciousLogin(parsedEvents);


            const allAlerts = [

            ...bruteForceAlerts,

            ...privilegeAlerts,

            ...cronAlerts,

            ...loginAlerts

        ];

        // =========================
        // GENERATE AI ANALYSIS
        // =========================

            const aiAnalysis =
                await generateAIAnalysis(

                    parsedEvents,

                    allAlerts

                );



        // =========================
        // SAVE ALERTS
        // =========================
        if (allAlerts.length > 0) {
            for (const alert of allAlerts) {
                const existing = await Alert.findOne({
                    alert_type: alert.alert_type,
                    source_ip: alert.source_ip || null,
                    username: alert.username || null,
                    mitre_technique: alert.mitre_technique,
                    // Only consider it duplicate if created within last 10 minutes
                    generatedAt: {
                        $gte: new Date(Date.now() - 10 * 60 * 1000)
                    }
                });

                if (!existing) {
                    await Alert.create(alert);
                }
            }
}




                // Response
                res.status(201).json({

                    success: true,

                    message: "Log uploaded & parsed successfully",

                    uploadedLog,

                    parsedEvents,

                    alerts:allAlerts,

                    aiAnalysis

                });

            } catch (error) {
                        
                res.status(500).json({

                    success: false,

                    message: error.message,

                    

                });

            }

        };

