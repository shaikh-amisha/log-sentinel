import {
    buildAttackGraph
} from "../services/graphBuilder.js";

export const getAttackGraph =
async (req, res) => {

    try {

        const graph =
            await buildAttackGraph();

        res.json({
            success: true,
            graph
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message:
                "Failed to generate graph."
        });

    }
};