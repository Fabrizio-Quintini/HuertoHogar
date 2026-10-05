import { fireEvent, render, screen } from '@testing-library/react';
import { CarritoProvider, useCarrito, CLAVE_CARRITO } from './CarritoContext';
import { formatearPrecio } from '../utils/formato';

const MANZANAS = { codigo: 'FR001', nombre: 'Manzanas Fuji', precio: 1500 };
const ESPINACAS = { codigo: 'VR002', nombre: 'Espinacas Frescas', precio: 1100 };

function BancoDePruebas() {
    const {
        agregar,
        actualizarCantidad,
        eliminar,
        subtotal,
        envio,
        total,
        totalItems
    } = useCarrito();

    return (
        <div>
            <button onClick={() => agregar(MANZANAS)}>Agregar manzanas</button>
            <button onClick={() => agregar(ESPINACAS)}>Agregar espinacas</button>
            <button onClick={() => actualizarCantidad('FR001', 3)}>Tres manzanas</button>
            <button onClick={() => actualizarCantidad('FR001', 0)}>Cero manzanas</button>
            <button onClick={() => eliminar('FR001')}>Eliminar manzanas</button>

            <p>{`subtotal: ${formatearPrecio(subtotal)}`}</p>
            <p>{`envio: ${formatearPrecio(envio)}`}</p>
            <p>{`total: ${formatearPrecio(total)}`}</p>
            <p>{`items: ${totalItems}`}</p>
        </div>
    );
}

function renderCarrito() {
    return render(
        <CarritoProvider>
            <BancoDePruebas />
        </CarritoProvider>
    );
}

describe('CarritoContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('acumula la cantidad en una sola linea cuando el producto ya esta en el carrito', () => {
        renderCarrito();

        fireEvent.click(screen.getByText('Agregar manzanas'));
        fireEvent.click(screen.getByText('Agregar manzanas'));
        fireEvent.click(screen.getByText('Agregar espinacas'));

        const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));

        // Agregar dos veces el mismo producto no crea una linea duplicada.
        expect(guardado.length).toBe(2);
        expect(guardado[0].cantidad).toBe(2);
    });

    it('calcula subtotal, envio, total y el numero de items a partir de las lineas', () => {
        renderCarrito();

        fireEvent.click(screen.getByText('Agregar manzanas'));
        fireEvent.click(screen.getByText('Agregar espinacas'));

        expect(screen.getByText(`subtotal: ${formatearPrecio(2600)}`)).toBeTruthy();
        expect(screen.getByText(`total: ${formatearPrecio(4590)}`)).toBeTruthy();

        fireEvent.click(screen.getByText('Agregar manzanas'));
        expect(screen.getByText('items: 3')).toBeInTheDocument();
    });

    it('elimina la linea cuando la cantidad llega a cero y cuando se pide eliminarla', () => {
        renderCarrito();

        fireEvent.click(screen.getByText('Agregar manzanas'));
        fireEvent.click(screen.getByText('Agregar espinacas'));
        fireEvent.click(screen.getByText('Tres manzanas'));

        expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))[0].cantidad).toBe(3);

        fireEvent.click(screen.getByText('Cero manzanas'));

        expect(
            JSON.parse(localStorage.getItem(CLAVE_CARRITO)).map((item) => item.codigo)
        ).toEqual(['VR002']);

        fireEvent.click(screen.getByText('Eliminar manzanas'));

        expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO)).length).toBe(1);
    });

    // Regresión: sin esto, un hh_carrito con otra forma (datos de una versión
    // anterior o editados a mano) provoca "items.reduce is not a function"
    // y la aplicación entera queda en pantalla blanca.
    it('restaura el carrito entre recargas y arranca vacio si lo guardado no es utilizable', () => {
        const primera = renderCarrito();

        fireEvent.click(screen.getByText('Agregar manzanas'));
        fireEvent.click(screen.getByText('Agregar espinacas'));

        // Se desmonta para simular una recarga completa de la pagina.
        primera.unmount();

        renderCarrito();

        expect(screen.getByText(`subtotal: ${formatearPrecio(2600)}`)).toBeInTheDocument();

        // Un almacen con forma de objeto, o con JSON corrupto, debe llevar a un
        // carrito vacio en lugar de propagar el error.
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify({ producto: 'Manzanas Fuji' }));

        const segunda = renderCarrito();

        expect(screen.getAllByText(`subtotal: ${formatearPrecio(0)}`).length).toBeGreaterThan(0);

        segunda.unmount();
        localStorage.setItem(CLAVE_CARRITO, '{esto no es json');

        expect(() => renderCarrito()).not.toThrow();
    });
});