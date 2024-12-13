let currentEditId = null;

document.addEventListener('DOMContentLoaded', function () {
    // Inicializa la galería de skates
    loadAllSkatesGallery();

    // Asocia el evento 'click' al botón de cerrar modal
    const closeModalButton = document.getElementById('closeModal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }
});

function loadAllSkatesGallery() {
    fetch('/api/designs')
        .then(response => response.json())
        .then(data => {
            const gallery = document.getElementById('allSkatesGallery');
            gallery.innerHTML = ''; // Limpiar la galería antes de cargar nuevas imágenes
            data.forEach(design => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'img-container';

                const img = document.createElement('img');
                img.src = design.image;
                img.width = 200;

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Eliminar';
                deleteBtn.addEventListener('click', () => deleteDesign(design._id));

                const editBtn = document.createElement('button');
                editBtn.textContent = 'Editar';
                editBtn.addEventListener('click', () => openEditModal(design._id));

                imgContainer.appendChild(img);
                imgContainer.appendChild(deleteBtn);
                imgContainer.appendChild(editBtn);

                gallery.appendChild(imgContainer);
            });
        })
        .catch(err => console.error('Error al cargar la galería:', err));
}

function deleteDesign(id) {
    fetch(`/api/designs/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        alert('Diseño eliminado exitosamente!');
        loadAllSkatesGallery(); // Recargar la galería después de eliminar
    });
}

function openEditModal(id) {
    currentEditId = id;
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'block';
    } else {
        console.error('No se encontró el modal de edición.');
    }
}

function closeModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'none';
    }
}

document.getElementById('editForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const text = document.getElementById('editText').value;
    const font = document.getElementById('editFont').value;
    const color = document.getElementById('editColor').value;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = '/images/skateboard.webp';
    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.font = `30px "${font}"`;
        ctx.fillStyle = color;
        ctx.fillText(text, 50, 150);

        const updatedImage = canvas.toDataURL('image/png');
        fetch(`/api/designs/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: updatedImage })
        })
        .then(response => response.json())
        .then(data => {
            alert('Diseño actualizado exitosamente!');
            closeModal();
            loadAllSkatesGallery(); // Recargar la galería después de actualizar
        });
    };
});
