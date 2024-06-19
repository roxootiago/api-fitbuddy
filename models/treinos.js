import mongoose from 'mongoose';

const treinoSchema = new mongoose.Schema({ 
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        default: Date.now
    },
    exercises: [{
        type: mongoose.Schema.Types.ObjectId,
    }]
})

export default mongoose.model('Treino', treinoSchema)