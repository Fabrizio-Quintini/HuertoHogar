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
        vaciar,
        totalItems,
        subtotal,
        envio,
        total
    } = useCarrito();

    return (
        <div>
            <button onClick={() => agregar(MANZANAS)}>Agregar manzanas</button>
            <button onClick={() => agregar(ESPINACAS)}>Agregar espinacas</button>
            <button onClick={() => actualizarCantidad('FR001', 3)}>Tres manzanas</button>
            <button onClick={() => actualizarCantidad('FR001', 0)}>Cero manzanas</button>
            <button onClick={() => actualizarCantidad('FR001', '')}>Cantidad vacia</button>
            <button onClick={() => eliminar('FR001')}>Eliminar manzanas</button>
            <button onClick={vaciar}>Vaciar</button>

            <p>{`subtotal: ${formatearPrecio(subtotal)}`}</p>
            <p>{`envio: ${formatearPrecio(envio)}`}</p>
            <p>{`total: ${formatearPrecio(total)}`}</p>
            <p>{`items: ${totalItems}`}</p>
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

    // Regresión: sin esto, un hh_carrito con otra forma (datos de una versión
    // anterior o editados a mano) provoca "items.reduce is not a function"
    // y la aplicación entera queda en pantalla blanca.
    it('arranca con un carrito vacio cuando lo guardado no es un array', () => {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify({ producto: 'Manzanas Fuji' }));

        expect(() =>
            render(
                <CarritoProvider>
                    <BancoDePruebas />
                </CarritoProvider>
            )
        ).not.toThrow();

        expect(screen.getByText(`subtotal: ${formatearPrecio(0)}`)).toBeInTheDocument();
    });

    it('arranca con un carrito vacio cuando el JSON guardado esta corrupto', () => {
        localStorage.setItem(CLAVE_CARRITO, '{esto no es json');

        expect(() =>
            render(
                <CarritoProvider>
                    <BancoDePruebas />
                </CarritoProvider>
            )
        ).not.toThrow();
    });

    it('descarta las lineas corruptas y conserva las validas', () => {
        localStorage.setItem(
            CLAVE_CARRITO,
            JSON.stringify([MANZANAS, null, { sinCodigo: true }, ESPINACAS])
        );

        render(
            <CarritoProvider>
                <BancoDePruebas />
            </CarritoProvider>
        );

        const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));

        expect(guardado.map((item) => item.codigo)).toEqual(['FR001', 'VR002']);
    });

    it('normaliza las cantidades fuera de rango al leer el carrito', () => {
        localStorage.setItem(
            CLAVE_CARRITO,
            JSON.stringify([{ ...MANZANAS, cantidad: 500 }, { ...ESPINACAS, cantidad: 0 }])
        );

        render(
            <CarritoProvider>
                <BancoDePruebas />
            </CarritoProvider>
        );

        const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO));

        expect(guardado[0].cantidad).toBe(99);
        expect(guardado[1].cantidad).toBe(1);
    });

    it('restaura el carrito guardado entre recargas', () => {
        const primera = render(
            <CarritoProvider>
                <BancoDePruebas />
            </CarritoProvider>
        );

        fireEvent.click(screen.getByText('Agregar manzanas'));
        fireEvent.click(screen.getByText('Agregar espinacas'));

        // Se desmonta para simular una recarga completa de la pagina.
        primera.unmount();

        render(
            <CarritoProvider>
                <BancoDePruebas />
            </CarritoProvider>
        );

        expect(screen.getByText(`subtotal: ${formatearPrecio(2600)}`)).toBeInTheDocument();
    });

    it('no borra la linea cuando la cantidad llega vacia desde el input', () => {
        render(
            <CarritoProvider>
                <BancoDePruebas />
            </CarritoProvider>
        );

        fireEvent.click(screen.getByText('Agregar manzanas'));
        fireEvent.click(screen.getByText('Agregar espinacas'));

        // El input type="number" entrega '' al borrarse para reescribir.
        fireEvent.click(screen.getByText('Cantidad vacia'));

        expect(
            JSON.parse(localStorage.getItem(CLAVE_CARRITO)).map((item) => item.codigo)
        ).toEqual(['FR001', 'VR002']);
    });

    it('expone un total de items coherente con las lineas', () => {
        render(
            <CarritoProvider>
                <BancoDePruebas />
            </CarritoProvider>
        );

        fireEvent.click(screen.getByText('Agregar manzanas'));
        fireEvent.click(screen.getByText('Agregar manzanas'));
        fireEvent.click(screen.getByText('Agregar espinacas'));

        expect(screen.getByText('items: 3')).toBeInTheDocument();
    });

    it('vaciar deja el carrito sin lineas', () => {
        render(
            <CarritoProvider>
                <BancoDePruebas />
            </CarritoProvider>
        );

        fireEvent.click(screen.getByText('Agregar manzanas'));
        fireEvent.click(screen.getByText('Vaciar'));

        expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))).toEqual([]);
    });
});