// ==========================================================================
// SEMANA 8 (CÓDIGO UNIFICADO)
// ==========================================================================

// 1. DECLARACIÓN DE VARIABLES GLOBALES
const form = document.getElementById('form-producto');
const inputNombre = document.getElementById('prod-nombre'); 
const inputCantidad = document.getElementById('prod-cantidad'); 
const selectCategoria = document.getElementById('prod-categoria');
const listaContenedor = document.getElementById('lista-productos'); 
const totalRegistros = document.getElementById('total-registros'); 

let catalogoPrendas = [];

// 2. INICIALIZACIÓN DE EVENTOS Y VALIDACIONES
document.addEventListener('DOMContentLoaded', () => {
    if(inputNombre) {
        inputNombre.addEventListener('change', validarNombre);
        inputNombre.addEventListener('blur', validarNombre);
    }
    if(inputCantidad) {
        inputCantidad.addEventListener('change', validarCantidad);
        inputCantidad.addEventListener('blur', validarCantidad);
    }
    if(selectCategoria) {
        selectCategoria.addEventListener('change', validarCategoria);
        selectCategoria.addEventListener('blur', validarCategoria);
    }
    if(form) {
        form.addEventListener('submit', manejarEnvio);
    }
    renderizarCatalogo();
});

// 3. FUNCIONES DE VALIDACIÓN
function validarNombre() {
    if (!inputNombre || inputNombre.value === "") {
        mostrarError(inputNombre, "Debes seleccionar una prenda de la lista.");
        return false;
    }
    mostrarExito(inputNombre);
    return true;
}

function validarCantidad() {
    if (!inputCantidad || inputCantidad.value === "") {
        mostrarError(inputCantidad, "Debes seleccionar la cantidad en docenas.");
        return false;
    }
    mostrarExito(inputCantidad);
    return true;
}

function validarCategoria() {
    if (!selectCategoria || selectCategoria.value === "") {
        mostrarError(selectCategoria, "Por favor, selecciona una categoría.");
        return false;
    }
    mostrarExito(selectCategoria);
    return true;
}

function mostrarError(elemento, mensaje) {
    if(!elemento) return;
    elemento.classList.remove('is-valid');
    elemento.classList.add('is-invalid');
    const feedback = elemento.nextElementSibling; 
    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = mensaje;
    }
}

function mostrarExito(elemento) {
    if(!elemento) return;
    elemento.classList.remove('is-invalid');
    elemento.classList.add('is-valid');
}

// 4. MANEJO DEL ENVÍO DEL PRODUCTO 
function manejarEnvio(evento) {
    evento.preventDefault();

    const nValido = validarNombre();
    const qValido = validarCantidad();
    const cValido = validarCategoria();

    if (nValido && qValido && cValido) {
        
        const nuevaPrenda = {
            id: Date.now(),
            nombre: inputNombre.value,
            cantidad: inputCantidad.value,
            categoria: selectCategoria.value
        };

        catalogoPrendas.push(nuevaPrenda);
        renderizarCatalogo(); 
        
        form.reset();
        inputNombre.classList.remove('is-valid');
        inputCantidad.classList.remove('is-valid');
        selectCategoria.classList.remove('is-valid');

        const modalElement = document.getElementById('modalCompra');
        if (modalElement) {
            const miModal = new bootstrap.Modal(modalElement);
            miModal.show();
        }
    }
}

// 5. RENDERIZADO Y CONTADORES EN TIEMPO REAL
function renderizarCatalogo() {
    if (totalRegistros) {
        totalRegistros.textContent = catalogoPrendas.length;
    }

    if (!listaContenedor) return;
    listaContenedor.innerHTML = "";

    if (catalogoPrendas.length === 0) {
        listaContenedor.innerHTML = `<p class="text-muted text-center py-3">No hay productos ingresados temporalmente.</p>`;
        return;
    }

    catalogoPrendas.forEach(prenda => {
        const div = document.createElement('div');
        div.classList.add('col-md-6', 'col-lg-4', 'mb-3');
        div.innerHTML = `
            <div class="card h-100 shadow-sm border-start border-danger border-3">
                <div class="card-body d-flex flex-column justify-content-between">
                    <div>
                        <span class="badge bg-danger mb-2">${prenda.categoria}</span>
                        <h5 class="card-title fw-bold text-dark mb-1">${prenda.nombre}</h5>
                        <p class="card-text text-muted small mb-0">Pedido: <strong>${prenda.cantidad}</strong></p>
                    </div>
                    <button class="btn btn-outline-danger btn-sm mt-3 w-100" onclick="eliminarPrenda(${prenda.id})">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
        listaContenedor.appendChild(div);
    });
}

window.eliminarPrenda = function(id) {
    catalogoPrendas = catalogoPrendas.filter(p => p.id !== id);
    renderizarCatalogo();
};

// 6. FLUJO POST-COMPRA (Actualizado con Spinner y Alerta Bootstrap)
window.cerrarCompra = function() {
    const modalElement = document.getElementById('modalCompra');
    if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) modalInstance.hide();
    }

    // Abrir de inmediato el modal de registro de datos de envío
    setTimeout(() => {
        const modalEnvioElement = document.getElementById('modalDatosEnvio');
        if (modalEnvioElement) {
            const modalEnvio = new bootstrap.Modal(modalEnvioElement);
            modalEnvio.show();
        }
    }, 400); 
};

// Capturar el envío definitivo del cliente
document.addEventListener('DOMContentLoaded', () => {
    const formEnvio = document.getElementById('form-datos-envio');
    if (formEnvio) {
        formEnvio.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombreCli = document.getElementById('envio-nombre').value;
            const idCli = document.getElementById('envio-id').value;
            const dirCli = document.getElementById('envio-direccion').value;
            const telCli = document.getElementById('envio-telefono').value;

            // 1. Mostrar el Spinner en el botón de submit
            const btnSubmit = e.target.querySelector('button[type="submit"]');
            const textoOriginal = btnSubmit.innerHTML;
            btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando pedido...`;
            btnSubmit.disabled = true;

            // 2. Simular un tiempo de carga con setTimeout (2 segundos)
            setTimeout(() => {
                // Restaurar el botón
                btnSubmit.innerHTML = textoOriginal;
                btnSubmit.disabled = false;

                // Cerrar el modal de envío
                const modalEnvioElement = document.getElementById('modalDatosEnvio');
                if (modalEnvioElement) {
                    const modalInstance = bootstrap.Modal.getInstance(modalEnvioElement);
                    if (modalInstance) modalInstance.hide();
                }

                // 3. Mostrar la Alerta de Bootstrap
                const alertaContenedor = document.getElementById('alerta-notificacion');
                alertaContenedor.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show shadow-lg" role="alert">
                        <h4 class="alert-heading fw-bold"><i class="bi bi-check-circle-fill"></i> ¡Envío Programado!</h4>
                        <p>Tu orden para <strong>${nombreCli}</strong> ha sido procesada con éxito y será enviada a <strong>${dirCli}</strong>.</p>
                        <hr>
                        <p class="mb-0 small">Nos contactaremos al ${telCli} para coordinar la entrega.</p>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;

                // Limpiar el formulario y el carrito
                formEnvio.reset();
                catalogoPrendas = [];
                renderizarCatalogo();

                // Eliminar la alerta automáticamente después de 5 segundos
                setTimeout(() => {
                    alertaContenedor.innerHTML = '';
                }, 5000);

            }, 2000); 
        });
    }
});
