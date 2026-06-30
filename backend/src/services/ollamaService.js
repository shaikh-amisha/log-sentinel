import fetch from "node-fetch";

const OLLAMA_URL = "http://localhost:11434/api/generate";
const MODEL = "phi3.5:latest";

const callOllama = async (prompt, num_predict = 400) => {
    const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: MODEL,
            prompt,
            stream: false,
            options: { num_predict }
        })
    });
    const data = await response.json();
    return data.response || "";
};

// =========================
// GENERATE AI ANALYSIS
// =========================

export const generateAIAnalysis = async (parsedEvents, alerts) => {
    try {

        const eventSummary = parsedEvents.slice(0, 20).map(e =>
            `[${e.timestamp}] ${e.eventType} | IP: ${e.ip} | User: ${e.user} | Severity: ${e.severity}`
        ).join("\n");

        const prompt = `
You are a SOC Analyst AI. Generate a SHORT incident report.

Rules:
- Maximum 150 words total
- Be concise and technical
- SOC-style language only
- Do not repeat the data back
- Do not explain what the data is

Format your response exactly like this:

Threat Summary:
(2-3 lines describing the attack)

Risk Level: (Low/Medium/High/Critical)

MITRE Techniques:
- (technique and ID)

Recommendations:
- (action 1)
- (action 2)
- (action 3)

Security Events:
${eventSummary || "No events available."}

Report:`;

        const response = await callOllama(prompt, 300);
        return response;

    } catch (error) {
        console.error("OLLAMA ERROR:", error);
        return "AI analysis failed.";
    }
};

// =========================
// GENERATE INCIDENT REPORT
// =========================

export const generateIncidentReport = async (incident) => {
    try {

        const prompt = `
You are a SOC Analyst AI. Generate a professional incident report.

Rules:
- Maximum 200 words
- Technical and concise
- SOC-style formatting only
- Do not describe the JSON structure

Format exactly:

Threat Summary:
(brief paragraph)

Affected Entities:
- IPs: (list)
- Users: (list)

MITRE ATT&CK:
- (techniques)

Risk Assessment:
(one short paragraph)

Recommendations:
- (action 1)
- (action 2)
- (action 3)

Incident Data:
${JSON.stringify(incident, null, 2)}

Report:`;

        const response = await callOllama(prompt, 350);
        return response;

    } catch (error) {
        console.error("INCIDENT AI ERROR:", error);
        return "Failed to generate incident report.";
    }
};

// =========================
// INVESTIGATION CHAT
// =========================

export const askOllama = async (context) => {
    try {

        const prompt = `
You are LogSentinel AI, a SOC analyst assistant.

Rules:
- Answer in 100 - 150 words maximum and should be pointwise
- Answer the user's question directly and naturally
- Use plain English, not JSON or raw data
- Be technical but readable
- Do not list object IDs or database fields
- Do not describe what the data "represents"
- Focus only on what the user asked
- If the user says thanks, greetings, or anything non-security related, respond warmly and ask if they have any security questions
- If the user greets you, introduce yourself briefly and ask how you can help


${context}

Answer:`;

        const response = await callOllama(prompt, 500);
        return response;

    } catch (err) {
        console.error("CHAT OLLAMA ERROR:", err);
        return "Unable to analyze the incident.";
    }
};