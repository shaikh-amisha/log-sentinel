import LogEntry from "../models/LogEntry.js";

export const buildAttackGraph = async () => {
    const logs = await LogEntry.find().sort({
        createdAt: 1
    });

    const nodes = [];
    const edges = [];

    const nodeSet = new Set();
    const edgeSet = new Set();

    const addNode = (
        id,
        label,
        type
    ) => {

        if (nodeSet.has(id)) {
            return;
        }

        nodes.push({
            data: {
                id,
                label,
                type
            }
        });

        nodeSet.add(id);
    };

    const addEdge = (
        source,
        target
    ) => {

        const key =
            `${source}-${target}`;

        if (edgeSet.has(key)) {
            return;
        }

        edges.push({
            data: {
                source,
                target
            }
        });

        edgeSet.add(key);
    };

    logs.forEach(log => {

        // =====================
        // EVENT NODE
        // =====================

        const eventName =
            log.eventType || "Unknown";

        const eventId =
            `event-${eventName}`;

        addNode(
            eventId,
            eventName,
            "event"
        );

        // =====================
        // SOURCE IP
        // =====================

        if (
            log.sourceIp &&
            log.sourceIp !== "-"
        ) {

            const ipId =
                `ip-${log.sourceIp}`;

            addNode(
                ipId,
                log.sourceIp,
                "ip"
            );

            addEdge(
                ipId,
                eventId
            );
        }

        // =====================
        // USER
        // =====================

        if (
            log.username &&
            log.username !== "-"
        ) {

            const userId =
                `user-${log.username}`;

            addNode(
                userId,
                log.username,
                "user"
            );

            addEdge(
                eventId,
                userId
            );
        }

        // =====================
        // MITRE
        // =====================

        if (
            log.mitre &&
            log.mitre !== "-"
        ) {

            const mitreId =
                `mitre-${log.mitre}`;

            addNode(
                mitreId,
                log.mitre,
                "mitre"
            );

            addEdge(
                eventId,
                mitreId
            );
        }
    });

    return {
        nodes,
        edges
    };
};