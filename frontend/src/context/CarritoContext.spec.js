import { fireEvent, render, screen } from '@testing-library/react';
import { CarritoProvider, useCarrito, CLAVE_CARRITO } from './CarritoContext';
import { formatearPrecio } from '../utils/formato';

const MANZANAS = { codigo: 'FR001', nombre: 'Manzanas Fuji', precio: 1500 };
const ESPINACAS = { codigo: 'VR002', nombre: 'Espinacas Frescas', precio: 1100 };

function BancoDePruebas() {
    const { agregar, actualizarCantidad, eliminar, subtotal, envio, total } = useCarrito();

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
        </div>
    );
}

describe('CarritoContext', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('acumula la cantidad en una sola linea cuando el producto ya esta en el carrito', () => {
        render(
            <CarritoProvider>
                <BancoDePruebas />
            </CarritoProvider>
        );

        fireEvent.click(screen.getByText('Agregar manzanas'));
        fireEvent.click(screen.getByText('Agregar manzanas'));

        const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));

        expect(guardado.length).toBe(1);
        expect(guardado[0].cantidad).toBe(2);
    });

    it('calcula subtotal, envio y total a partir de las lineas del carrito', () => {
        render(
            <CarritoProvider>
                <BancoDePruebas />
            </CarritoProvider>
        );

        fireEvent.click(screen.getByText('Agregar manzanas'));
        fireEvent.click(screen.getByText('Agregar espinacas'));

        expect(screen.getByText(`subtotal: ${formatearPrecio(2600)}`)).toBeTruthy();
        expect(screen.getByText(`total: ${formatearPrecio(4590)}`)).toBeTruthy();
    });

    it('elimina la linea cuando la cantidad llega a cero y cuando se pide eliminarla', () => {
        render(
            <CarritoProvider>
                <BancoDePruebas />
            </CarritoProvider>
        );

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
});