document.getElementById('designForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const text = document.getElementById('text').value;
    const font = document.getElementById('font').value;
    const color = document.getElementById('color').value;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = '/img/skateboard.jpg';
    img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas antes de dibujar
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.font = `30px "${font}"`;
        ctx.fillStyle = color; // Asegúrate de establecer el color del texto
        ctx.fillText(text, 50, 150);

        const imageData = canvas.toDataURL('img/jpg');
        fetch('/api/designs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: imageData })
        })
        .then(response => response.json())
        .then(data => {
            alert('Diseño guardado exitosamente!');
            loadGallery(); // Asegúrate de que se llame a loadGallery después de guardar el diseño
        });
    };
});

function loadGallery() {
    fetch('/api/designs')
        .then(response => response.json())
        .then(data => {
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = ''; // Limpiar la galería antes de cargar nuevas imágenes
            data.forEach(design => {
                const img = document.createElement('img');
                img.src = design.image;
                img.width = 200;
                gallery.appendChild(img);
            });
        });
}

document.getElementById('viewSkatesBtn').addEventListener('click', function () {
    window.location.href = 'skates.html';
});

document.addEventListener('DOMContentLoaded', function () {
    loadGallery(); // Asegúrate de cargar la galería al cargar la página
});
