export const COSTO_ENVIO = 1990;

export const CANTIDAD_MAXIMA = 99;

const CANTIDAD_MINIMA = 1;

/**
 * Indica si el valor tipeado en el input de cantidad está "vacío" o es ilegible.
 * Un input type="number" entrega '' cuando el usuario borra el contenido para
 * reescribirlo, y ese caso NO debe interpretarse como "quedarse sin unidades":
 * Number('') es 0, no NaN, y borraba la línea del carrito sin que el usuario lo pidiera.
 * @param {number|string} valor Valor tipeado por el usuario.
 * @returns {boolean} Verdadero si no hay nada que confirmar todavía.
 */
export function esCantidadVacia(valor) {
    return valor === '' || valor === null || valor === undefined;
}

/**
 * Convierte un valor proveniente del input numérico en una cantidad válida.
 * @param {number|string} valor Valor tipeado por el usuario.
 * @returns {number} Entero entre 1 y 99.
 */
export function normalizarCantidad(valor) {
    const numero = Number(valor);

    if (!Number.isFinite(numero)) {
        return CANTIDAD_MINIMA;
    }

    return Math.min(Math.max(Math.trunc(numero), CANTIDAD_MINIMA), CANTIDAD_MAXIMA);
}

/**
 * Indica si el producto se puede seguir aumentando en el carrito.
 * @param {number} cantidad Cantidad actual de la línea.
 * @returns {boolean} Verdadero mientras quede margen antes del tope.
 */
export function puedeAumentar(cantidad) {
    return normalizarCantidad(cantidad) < CANTIDAD_MAXIMA;
}

/**
 * Suma el precio de cada producto multiplicado por su cantidad.
 * @param {Array<{precio: number, cantidad: number}>} items Líneas del carrito.
 * @returns {number} Subtotal de la compra.
 */
export function calcularSubtotal(items) {
    if (!Array.isArray(items)) {
        return 0;
    }

    return items.reduce(
        (total, item) => total + (Number(item.precio) || 0) * normalizarCantidad(item.cantidad),
        0
    );
}

/**
 * @returns {number} Costo de despacho de la tienda.
 */
export function calcularEnvio() {
    return COSTO_ENVIO;
}

/**
 * @param {number} subtotal Subtotal de las líneas del carrito.
 * @param {number} envio Costo de despacho.
 * @returns {number} Total a pagar por la compra.
 */
export function calcularTotal(subtotal, envio) {
    return (Number(subtotal) || 0) + (Number(envio) || 0);
}

/**
 * Valida y completa una línea de carrito leída desde localStorage.
 * Los datos guardados pueden venir de una versión anterior de la app o estar
 * editados a mano, así que no se puede confiar en su forma: sin esto, un objeto
 * en vez de un array provoca "items.reduce is not a function" y la app revienta.
 * @param {object} linea Línea leída del almacenamiento.
 * @returns {object|null} Línea normalizada, o null si no es utilizable.
 */
export function normalizarLinea(linea) {
    if (!linea || typeof linea !== 'object' || Array.isArray(linea)) {
        return null;
    }

    if (!linea.codigo) {
        return null;
    }

    const precio = Number(linea.precio);

    return {
        ...linea,
        nombre: linea.nombre || '',
        precio: Number.isFinite(precio) ? precio : 0,
        cantidad: normalizarCantidad(linea.cantidad)
    };
}

/**
 * Punto de entrada seguro para leer el carrito persistido.
 * @param {*} contenido Texto plano obtenido de localStorage, o un array ya parseado.
 * @returns {Array<object>} Líneas válidas; lista vacía si el contenido es inservible.
 */
export function normalizarLineas(contenido) {
    let datos = contenido;

    if (typeof datos === 'string') {
        try {
            datos = JSON.parse(datos);
        } catch (error) {
            return [];
        }
    }

    if (!Array.isArray(datos)) {
        return [];
    }

    return datos.map(normalizarLinea).filter(Boolean);
}