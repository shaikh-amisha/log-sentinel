import { spawn } from "child_process";


// =========================
// RUN PYTHON PARSER
// =========================

export const runAuthParser = (filePath) => {

    return new Promise((resolve, reject) => {

        const pythonProcess = spawn(

            "python3",

            [

                "../ai-engine/auth_parser.py",

                filePath

            ]

        );

        let result = "";

        let errorOutput = "";


        // Capture Output
        pythonProcess.stdout.on("data", (data) => {

            result += data.toString();

        });


        // Capture Errors
        pythonProcess.stderr.on("data", (data) => {

            errorOutput += data.toString();

        });


        // Process Finished
        pythonProcess.on("close", (code) => {

            if (code !== 0) {

                reject(errorOutput);

            } else {

                try {

                    const parsedData =
                        JSON.parse(result);

                    resolve(parsedData);

                } catch (error) {

                    reject(error);

                }

            }

        });

    });

};