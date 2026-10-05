import productosIniciales from '../data/productos';

export const CLAVE_PRODUCTOS = 'hh_productos';

const LATENCIA_SIMULADA = 150;

const esperar = (milisegundos) =>
    new Promise((resolver) => setTimeout(resolver, milisegundos));

function leerDelAlmacen() {
    try {
        const contenido = localStorage.getItem(CLAVE_PRODUCTOS);
        const datos = contenido ? JSON.parse(contenido) : null;
        // Si el almacenamiento quedó corrupto o con otra forma, se descarta:
        // un objeto plano haría fallar guardados.map() y rompería el catálogo.
        return Array.isArray(datos) ? datos : null;
    } catch (error) {
        return null;
    }
}

function escribirEnAlmacen(productos) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
    return productos;
}

function obtenerTodos() {
    const guardados = leerDelAlmacen();

    if (!guardados) {
        return escribirEnAlmacen([...productosIniciales]);
    }

    const actualizados = guardados.map((productoGuardado) => {
        const productoInicial = productosIniciales.find(
            (producto) => producto.codigo === productoGuardado.codigo
        );

        if (!productoInicial) {
            return productoGuardado;
        }

        return {
            ...productoGuardado,
            imagen: productoInicial.imagen
        };
    });

    return escribirEnAlmacen(actualizados);
}

function listarProductos() {
    return esperar(LATENCIA_SIMULADA).then(obtenerTodos);
}

function listarPorCategoria(categoria) {
    return listarProductos().then((productos) =>
        productos.filter((producto) => producto.categoria === categoria)
    );
}

function crearProducto(producto) {
    return esperar(LATENCIA_SIMULADA).then(() => {
        const existentes = obtenerTodos();
        return escribirEnAlmacen([...existentes, { ...producto }]);
    });
}

function actualizarProducto(codigo, cambios) {
    return esperar(LATENCIA_SIMULADA).then(() => {
        const actualizados = obtenerTodos().map((producto) =>
            producto.codigo === codigo ? { ...producto, ...cambios } : producto
        );
        return escribirEnAlmacen(actualizados);
    });
}

function eliminarProducto(codigo) {
    return esperar(LATENCIA_SIMULADA).then(() => {
        const restantes = obtenerTodos().filter(
            (producto) => producto.codigo !== codigo
        );
        return escribirEnAlmacen(restantes);
    });
}

function reiniciarDatos() {
    return escribirEnAlmacen([...productosIniciales]);
}

export const productoService = {
    listarProductos,
    listarPorCategoria,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    reiniciarDatos
};

export default productoService;