import {
    generateIncidentReport
} from "../services/ollamaService.js";


// =========================
// GENERATE INCIDENT REPORT
// =========================

export const generateIncident =
async (req, res) => {

    try {

        const incident =
            req.body;

        const report =
            await generateIncidentReport(
                incident
            );

        res.status(200).json({

            success: true,

            report

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message:
                error.message

        });

    }

};