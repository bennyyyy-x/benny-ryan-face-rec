import path from 'path';
import config from '../config/config.json' with { type: 'json' };
import { exec } from 'child_process';

const __dirname = import.meta.dirname;

export function run(imagePath) {
    return new Promise((resolve, reject) => {
        const command = 'python3 ' + path.join(__dirname, config.pythonPath) + ' ' + imagePath;
        return exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(`error: ${error.message}`);
            }
            if (stderr) {
                return reject(`stderr: ${stderr}`);
            }
            console.log(`stdout: ${stdout}`);

            resolve(stdout);
        })
    });
}