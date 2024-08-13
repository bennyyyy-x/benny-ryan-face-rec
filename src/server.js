import path from 'path';
import express from 'express';
import http from 'http';
import fileUpload from 'express-fileupload';
import { run } from './detectFaces.js';
import fs from 'fs';
import config from '../config/config.json' with { type: 'json' };

const port = process.env.PORT || 8080;
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '../public')));
app.use(fileUpload());

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files were uploaded.');
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file
    const uploadPath = path.join(__dirname, '../uploads', file.name.replaceAll(' ', '_'))
    console.log('uploadPath is ' + uploadPath)

    file.mv(uploadPath, function(err) {
        if (err) {
            return res.status(500).send(err);
        }
        // Sends the result of face recognition
        run(uploadPath)
        .then(result => {
            let response;
            if (fs.existsSync(config.bennyImagePath) && fs.existsSync(config.ryanImagePath)) {
                response = "Both Benny and Ryan are in the picture.";
            } else if (fs.existsSync(config.bennyImagePath)) {
                response = "Benny is in the picture.";
            } else if (fs.existsSync(config.ryanImagePath)) {
                response = "Ryan is in the picture.";
            } else {
                response = "Neither Benny or Ryan is in the picture.";
            }
            res.send(response);
        })
        .catch(err => {
            console.error(err);
        });
    });
});

app.get('/benny', (req, res) => {
    if (!fs.existsSync(config.bennyImagePath)) {
        res.status(404).send(null);
        return;
    }
    const imagePath = path.join(__dirname, '..', config.bennyImagePath)
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading the file.');
        } else {
            console.log('File download started.');
        }
    });
});

app.get('/ryan', (req, res) => {
    if (!fs.existsSync(config.ryanImagePath)) {
        res.status(404).send(null);
        return;
    }
    const imagePath = path.join(__dirname, '..', config.ryanImagePath)
    res.sendFile(imagePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading the file.');
        } else {
            console.log('File download started.');
        }
    });
});

server.listen(port, () => console.log(`Server started on port ${port}`));