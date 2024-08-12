import path from 'path'
import express from 'express'
import http from 'http'
import fileUpload from 'express-fileupload'
import { run } from './detect_faces.js'

const __dirname = import.meta.dirname;

const app = express()
const server = http.createServer(app)

app.use(express.static(path.join(__dirname, '../public')))
app.use(fileUpload())

app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        console.log('No files were uploaded.')
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
        res.send(run(uploadPath))
    });
})

server.listen(8080, () => console.log('Server started on port 8080'))