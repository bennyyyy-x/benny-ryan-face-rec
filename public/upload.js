const form = document.getElementById("upload-form")
const output1 = document.getElementById("output1")

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });
})
