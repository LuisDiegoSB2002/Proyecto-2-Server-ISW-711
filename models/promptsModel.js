const mongoose= require("mongoose");

const PromptsSchema = new mongoose.Schema({
    name: String,
    tipo: String,
    idUser: String,
    etiquetas: String, 
});

module.exports = mongoose.model('prompts', PromptsSchema);