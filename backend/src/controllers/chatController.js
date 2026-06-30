import { buildContext } from "../services/contextBuilder.js";
import { askOllama } from "../services/ollamaService.js";

export const chat = async (req,res)=>{

    try{

        const { message } = req.body;

        const context =
            await buildContext(message);

        const response =
            await askOllama(context);

        res.status(200).json({
            success:true,
            response
        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({
            success:false,
            message:"AI request failed."
        });

    }

};