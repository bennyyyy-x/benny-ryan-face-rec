const form = document.getElementById('upload-form');
const output = document.getElementById('output');
const imageContainer = document.getElementById('image-container');
const originalImage = document.getElementById('original-image');
const fileInput = document.getElementById('upload-file');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    originalImage.innerHTML = '';
    imageContainer.innerHTML = '';
    output.innerHTML = 'Uploading...';

    const file = fileInput.files[0]
    if (file && (file.type === 'image/heic' || file.type === 'image/heif')) {
        heic2any({
            blob: file,
            toType: 'image/jpeg',
        }).then(convertedBlob => {
            const url = URL.createObjectURL(convertedBlob);
            originalImage.innerHTML = `
                <p>Original Image:</p>
                <img src="${url}" alt="Original Image" id="original-image">
            `;
        }).catch((error) => {
            console.error('Error converting HEIC file:', error);
        });
    } else if (file) {
        const originalUrl = URL.createObjectURL(file);
        originalImage.innerHTML = `
            <p>Original Image:</p>
            <img src="${originalUrl}" alt="Original Image" id="original-image">
        `;
    }

    const formData = new FormData(form);
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        output.innerHTML = data
        fetchImages(data)
    })
    .catch(error => {
        console.error(error);
    });
})

function fetchImages(res) {
    editCss(res);
    if (res.includes('Neither')) {
        return
    }
    if (res.includes('Benny')) {
        fetchBenny();
    }
    if (res.includes('Ryan')) {
        fetchRyan();
    }
}

function fetchBenny() {
    fetch('/benny', {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) { // Check if the response status is not OK (e.g., 404, 500)
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob()
    })
    .then(blob => {
        const url = URL.createObjectURL(blob);
        const div = document.createElement('div');
        div.className = 'column';
        div.innerHTML = `
            <p>Benny:</p>
            <img src="${url}" alt="Benny Image" style="width:100%">
        `;
        imageContainer.appendChild(div);
    })
    .catch(error => {
        console.error(error);
    });
}

function fetchRyan() {
    fetch('/ryan', {
        method: 'GET'
    })
    .then(response => {
        if (!response.ok) { // Check if the response status is not OK (e.g., 404, 500)
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob()
    })
    .then(blob => {
        const url = URL.createObjectURL(blob);
        const div = document.createElement('div');
        div.className = 'column';
        div.innerHTML = `
            <p>Ryan:</p>
            <img src="${url}" alt="Ryan Image" style="width:100%">
        `;
        imageContainer.appendChild(div);
    })
    .catch(error => {
        console.error(error);
    });
}

function editCss(res) {
    let width;
    if (!res.includes('Benny') || !res.includes('Ryan')) {
        width = '25%';
    } else {
        width = '50%';
    }

    const sheet = document.styleSheets[0];
    for (let i = 0; i < sheet.cssRules.length; i++) {
        if (sheet.cssRules[i].selectorText === '#image-container') {
            sheet.cssRules[i].style.width = width;
        }
    }
}