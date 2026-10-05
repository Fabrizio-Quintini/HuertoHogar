import { createContext, useContext, useEffect, useState } from 'react';
import {
    calcularEnvio,
    calcularSubtotal,
    calcularTotal,
    esCantidadVacia,
    normalizarCantidad,
    normalizarLineas
} from '../utils/carrito';

export const CLAVE_CARRITO = 'hh_carrito';

const CarritoContext = createContext(null);

function leerCarritoGuardado() {
    try {
        return normalizarLineas(localStorage.getItem(CLAVE_CARRITO));
    } catch (error) {
        return [];
    }
}

/**
 * Agrega un producto al carrito o aumenta la cantidad si ya estaba agregado.
 * Evita duplicar la línea para que el resumen muestre una sola fila por producto.
 * @param {object} producto Producto a sumar.
 * @returns {void}
 */
function agregarItem(items, producto) {
    const existente = items.find((item) => item.codigo === producto.codigo);

    if (!existente) {
        return [...items, { ...producto, cantidad: 1 }];
    }

    return items.map((item) =>
        item.codigo === producto.codigo
            ? { ...item, cantidad: normalizarCantidad(item.cantidad + 1) }
            : item
    );
}

/**
 * Cambia la cantidad de una línea.
 * - Si el usuario borra el contenido del input para reescribirlo, la cantidad
 *   llega vacía y NO se toca la línea: borrarla en ese momento hacía que el
 *   producto desapareciera del carrito al simple hecho de teclear.
 * - Si la cantidad llega a 0 o es ilegible, la línea se elimina en lugar de
 *   dejar el carrito en un estado imposible.
 * @param {Array<object>} items Líneas del carrito.
 * @param {string} codigo Código del producto a modificar.
 * @param {number|string} cantidad Nueva cantidad.
 * @returns {Array<object>} Líneas actualizadas.
 */
function cambiarCantidad(items, codigo, cantidad) {
    if (esCantidadVacia(cantidad)) {
        return items;
    }

    const numero = Number(cantidad);
    const quedaSinUnidades = !Number.isFinite(numero) || numero < 1;

    if (quedaSinUnidades) {
        return items.filter((item) => item.codigo !== codigo);
    }

    return items.map((item) =>
        item.codigo === codigo ? { ...item, cantidad: normalizarCantidad(numero) } : item
    );
}

export function CarritoProvider({ children }) {
    const [items, setItems] = useState(leerCarritoGuardado);

    useEffect(() => {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
    }, [items]);

    const subtotal = calcularSubtotal(items);
    const envio = calcularEnvio();

    const valor = {
        items,
        totalItems: items.reduce(
            (total, item) => total + normalizarCantidad(item.cantidad),
            0
        ),
        subtotal,
        envio,
        total: calcularTotal(subtotal, envio),
        agregar: (producto) => setItems((actuales) => agregarItem(actuales, producto)),
        actualizarCantidad: (codigo, cantidad) =>
            setItems((actuales) => cambiarCantidad(actuales, codigo, cantidad)),
        eliminar: (codigo) =>
            setItems((actuales) => actuales.filter((item) => item.codigo !== codigo)),
        vaciar: () => setItems([])
    };

    return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>;
}

export function useCarrito() {
    const contexto = useContext(CarritoContext);

    if (!contexto) {
        throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
    }

    return contexto;
}

export default CarritoContext;