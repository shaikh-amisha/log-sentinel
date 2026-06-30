const GRAPH_API = "http://localhost:5000/api/graph";
const CHAT_API = "http://localhost:5000/api/chat";

let cyInstance = null;
let isRendering = false;

// =========================
// INIT
// =========================

window.addEventListener("DOMContentLoaded", () => {
    loadAttackGraph();
    setInterval(loadAttackGraph, 10000);

    document.getElementById("sendBtn")?.addEventListener("click", sendMessage);
    document.getElementById("chat-input")?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });
});

// =========================
// ATTACK GRAPH
// =========================

async function loadAttackGraph() {
    try {
        const response = await fetch(GRAPH_API);
        const data = await response.json();

        console.log("GRAPH", data);

        if (!data.success) return;

        renderGraph(data.graph.nodes, data.graph.edges);

    } catch (err) {
        console.error("GRAPH ERROR", err);
    }
}


function renderGraph(nodes, edges) {
    const container = document.getElementById("attackGraph");
    if (!container) return;
    if (isRendering) return;

    isRendering = true;

    if (cyInstance) {
        cyInstance.destroy();
        cyInstance = null;
    }

    cyInstance = cytoscape({
        container,
        elements: [...nodes, ...edges],
        minZoom: 0.3,
        maxZoom: 3,
        userZoomingEnabled: true,
        userPanningEnabled: true,
        boxSelectionEnabled: false,
        style: [
            {
                selector: "node",
                style: {
                    label: "data(label)",
                    color: "#ffffff",
                    width: 55,
                    height: 55,
                    "font-size": 11,
                    "text-wrap": "wrap",
                    "text-max-width": 100,
                    "text-valign": "center",
                    "text-halign": "center",
                    "background-color": "#0d6efd",
                    "border-width": 2,
                    "border-color": "#1e40af"
                }
            },
            {
                selector: 'node[type="ip"]',
                style: {
                    "background-color": "#dc3545",
                    "border-color": "#991b1b"
                }
            },
            {
                selector: 'node[type="user"]',
                style: {
                    "background-color": "#198754",
                    "border-color": "#14532d"
                }
            },
            {
                selector: 'node[type="mitre"]',
                style: {
                    "background-color": "#f59e0b",
                    "border-color": "#92400e"
                }
            },
            {
                selector: "node:selected",
                style: {
                    "border-width": 3,
                    "border-color": "#38bdf8"
                }
            },
            {
                selector: "edge",
                style: {
                    width: 2,
                    "line-color": "#4b5563",
                    "target-arrow-color": "#4b5563",
                    "target-arrow-shape": "triangle",
                    "curve-style": "bezier"
                }
            }
        ],
        layout: {
            name: "cose",
            animate: true,
            fit: true,
            padding: 60,
            nodeRepulsion: 400000,
            idealEdgeLength: 150,
            nodeOverlap: 20,
            randomize: false,
            componentSpacing: 100,
            nestingFactor: 1.2,
            gravity: 1,
            numIter: 1000,
            stop: () => {
                isRendering = false;
                // Lock node positions after layout so dragging doesn't shrink graph
                cyInstance.nodes().lock();
            }
        }
    });

    // Unlock nodes on drag so user can move them
    cyInstance.on("tapstart", "node", (e) => {
        e.target.unlock();
    });

    // Re-lock after drag ends
    cyInstance.on("tapend", "node", (e) => {
        e.target.lock();
    });

    // Prevent graph from resetting on container resize
    cyInstance.on("resize", () => {
        cyInstance.fit(undefined, 60);
    });
}

// =========================
// CHAT
// =========================

function appendMessage(text, type, isThinking = false) {
    const chatBox = document.getElementById("chat-messages");

    const div = document.createElement("div");
    div.className = type === "user"
        ? "user-message"
        : isThinking ? "ai-message thinking" : "ai-message";

    div.style.whiteSpace = "pre-wrap";
    div.textContent = text;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    return div;
}

async function sendMessage() {
    const input = document.getElementById("chat-input");
    const message = input.value.trim();

    if (!message) return;

    appendMessage(message, "user");
    input.value = "";

    // Show thinking indicator
    const thinkingEl = appendMessage("Analyzing...", "ai", true);

    try {
        const response = await fetch(CHAT_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        // Replace thinking with actual response
        thinkingEl.remove();
        appendMessage(
            data.response || "No response generated.",
            "ai"
        );

    } catch (err) {
        console.error("CHAT ERROR", err);
        thinkingEl.remove();
        appendMessage("Unable to contact AI assistant.", "ai");
    }
}