import path from 'path';
import express, { response } from 'express';
import http from 'http';
import fileUpload from 'express-fileupload';
import { run } from './detectFaces.js';
import fs from 'fs';
import config from '../config/config.json' with { type: 'json' };

const __dirname = import.meta.dirname;

const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '../public')));
app.use(fileUpload());

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files were uploaded.');
        return res.status(400).send({ 'res': 'No files were uploaded.' });
    }

    const file = req.files.file
    const uploadPath = path.join(__dirname, '../uploads', file.name)
    console.log('uploadPath is ' + uploadPath)

    file.mv(uploadPath, function(err) {
        if (err) {
            return res.status(500).send(err);
        }
        // Sends the result of face recognition
        run(uploadPath).then(result => {
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
            res.send({ 'res': response });
        }).catch(err => {
            console.log(err);
        });
    });
})

server.listen(8080, () => console.log('Server started on port 8080'));