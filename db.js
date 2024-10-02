const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://raheem:raheemshaik@cluster0.jyupv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
