document.addEventListener('DOMContentLoaded', () => {

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const botonesComprar = document.querySelectorAll('.boton_comprar');
    const carritoItemsContainer = document.getElementById('carrito-items');
    const carritoTotalElement = document.getElementById('carrito-total');
    const contadorCarrito = document.getElementById('contador-carrito');
    const botonFinalizarCompra = document.getElementById('finalizar-compra');

    botonesComprar.forEach(boton => {
        if (!boton.closest('.modal-footer')) {
            boton.addEventListener('click', agregarAlCarrito);
        }
    });

    botonFinalizarCompra.addEventListener('click', finalizarCompra);
    carritoItemsContainer.addEventListener('click', eliminarDelCarrito);

    actualizarCarrito();

    function agregarAlCarrito(evento) {
        const card = evento.target.closest('.card');

        const precioTexto = card.querySelector('.precio').textContent;
        const precioNumerico = parseFloat(precioTexto.replace(/[^0-9]/g, ''));

        const producto = {
            id: card.dataset.id,
            nombre: card.querySelector('.titulos').textContent,
            precio: precioNumerico,
            cantidad: 1
        };

        const productoExistente = carrito.find(item => item.id === producto.id);

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push(producto);
        }

        alert(`¡"${producto.nombre}" fue añadido al carrito!`);
        actualizarCarrito();
    }

    function actualizarCarrito() {
        carritoItemsContainer.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            carritoItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        } else {
            carrito.forEach(producto => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'mb-2');

                itemDiv.innerHTML = `
                    <div class="d-flex align-items-center">
                        <span class="textos">${producto.nombre} (x${producto.cantidad})</span>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="precio me-3">$${(producto.precio * producto.cantidad).toLocaleString('es-AR')}</span>
                        <button class="btn btn-danger btn-sm btn-eliminar" data-id="${producto.id}">X</button>
                    </div>
                `;

                carritoItemsContainer.appendChild(itemDiv);
                total += producto.precio * producto.cantidad;
            });
        }

        carritoTotalElement.textContent = `$${total.toLocaleString('es-AR')}`;
        contadorCarrito.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);

        guardarCarritoEnStorage();
    }

    function eliminarDelCarrito(evento) {
        if (evento.target.classList.contains('btn-eliminar')) {
            const productoId = evento.target.dataset.id;
            carrito = carrito.filter(producto => producto.id !== productoId);
            actualizarCarrito();
        }
    }

    function finalizarCompra() {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío. ¡Agregá productos para continuar!");
            return;
        }

        alert("¡Gracias por tu compra! Tu pedido fue realizado con éxito.");

        carrito = [];
        localStorage.removeItem('carrito');
        actualizarCarrito();

        const modal = bootstrap.Modal.getInstance(document.getElementById('modalCarrito'));
        if (modal) {
            modal.hide();
        }

        setTimeout(() => {
            window.location.href = './agradecimiento.html';
        }, 2000);
    }

    function guardarCarritoEnStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const selectCantidad = card.querySelectorAll('.boton_opciones')[0];
        const selectExtra = card.querySelectorAll('.boton_opciones')[1];
        const precioMostrado = card.querySelector('.precio');

        const precioUnidad = parseInt(card.dataset.unidad);
        const precioDocena = parseInt(card.dataset.docena);
        const precioExtra = parseInt(card.dataset.extra);

        function actualizarPrecio() {
            let precioBase = selectCantidad.value === 'Docena' ? precioDocena : precioUnidad;
            let extraSeleccionado = selectExtra.value !== 'Sin extras' ? precioExtra : 0;
            let precioFinal = precioBase + extraSeleccionado;

            precioMostrado.textContent = `$${precioFinal.toLocaleString('es-AR')}`;
        }

        selectCantidad.addEventListener('change', actualizarPrecio);
        selectExtra.addEventListener('change', actualizarPrecio);

        actualizarPrecio();
    });

});