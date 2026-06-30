import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({

    logSources:{
        type:[String],
        default:[
            "/var/log/auth.log",
            "/var/log/syslog",
            "/var/log/audit/audit.log"
        ]
    },

    ollama:{
        endpoint:{
            type:String,
            default:"http://localhost:11434"
        },

        model:{
            type:String,
            default:"mistral"
        }
    },

    threshold:{
        type:Number,
        default:70
    },

    notifications:{

        critical:{
            type:Boolean,
            default:true
        },

        mitre:{
            type:Boolean,
            default:true
        },

        incidents:{
            type:Boolean,
            default:false
        }

    },

    monitoring:{
        type:Boolean,
        default:true
    }

},{
    timestamps:true
});

export default mongoose.model("Settings",SettingsSchema);