const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://gleybertmartinez0702:07020207@cluster0.lukcq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

const DesignSchema = new mongoose.Schema({
    image: String
});

const Design = mongoose.model('Design', DesignSchema);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/designs', (req, res) => {
    const newDesign = new Design({ image: req.body.image });
    newDesign.save()
        .then(() => res.json({ message: 'Diseño guardado exitosamente!' }))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get('/api/designs', (req, res) => {
    Design.find()
        .then(designs => res.json(designs))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.delete('/api/designs/:id', (req, res) => {
    Design.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: 'Diseño eliminado exitosamente!' }))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.put('/api/designs/:id', (req, res) => {
    Design.findByIdAndUpdate(req.params.id, { image: req.body.image }, { new: true })
        .then(updatedDesign => res.json(updatedDesign))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
