import mongoose from "mongoose"

const exerciseSchema = new mongoose.Schema({
    exercise:{
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    data: [{
        linkImage: String 
    }],
    createadAt: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model('Exercise', exerciseSchema)