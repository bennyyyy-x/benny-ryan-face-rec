const form = document.getElementById('upload-form');
const output = document.getElementById('output');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        output.innerHTML = data.res;
    })
    .catch(error => {
        console.error(error);
    });
})
