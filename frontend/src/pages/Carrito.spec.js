import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LayoutTienda from '../templates/LayoutTienda';
import Carrito from './Carrito';
import { CarritoProvider, CLAVE_CARRITO } from '../context/CarritoContext';
import { COSTO_ENVIO } from '../utils/carrito';
import { formatearPrecio } from '../utils/formato';

const MANZANAS = {
    codigo: 'FR001',
    nombre: 'Manzanas Fuji',
    categoria: 'Frutas Frescas',
    precio: 1500,
    imagen: '/img/MANZANA-FUJI.jpg',
    cantidad: 2
};

const ESPINACAS = {
    codigo: 'VR002',
    nombre: 'Espinacas Frescas',
    categoria: 'Verduras Orgánicas',
    precio: 1100,
    imagen: '/img/espinaca.jpg',
    cantidad: 1
};

function renderCarrito() {
    return render(
        <MemoryRouter initialEntries={['/carrito']}>
            <CarritoProvider>
                <LayoutTienda>
                    <Carrito />
                </LayoutTienda>
            </CarritoProvider>
        </MemoryRouter>
    );
}

describe('Pagina Carrito', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('lista los productos guardados y calcula el total con el envio', async () => {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify([MANZANAS, ESPINACAS]));

        const { container } = renderCarrito();

        expect(container.querySelectorAll('.fila-carrito').length).toBe(2);
        expect(screen.getByText('Manzanas Fuji')).toBeTruthy();
        expect(screen.getByText('Espinacas Frescas')).toBeTruthy();
        expect(screen.getByText('Carrito (3)')).toBeTruthy();

        const subtotal = MANZANAS.precio * MANZANAS.cantidad + ESPINACAS.precio * ESPINACAS.cantidad;

        expect(screen.getByText(formatearPrecio(subtotal))).toBeTruthy();
        expect(screen.getByText(formatearPrecio(subtotal + COSTO_ENVIO))).toBeTruthy();
    });

    it('aumenta la cantidad de una linea y actualiza el total', async () => {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify([MANZANAS, ESPINACAS]));

        renderCarrito();

        fireEvent.click(
            screen.getByRole('button', { name: 'Agregar una unidad de Espinacas Frescas' })
        );

        await waitFor(() => expect(screen.getByText('Carrito (4)')).toBeTruthy());

        expect(
            screen.getByRole('spinbutton', { name: 'Cantidad de Espinacas Frescas' }).value
        ).toBe('2');

        const subtotal = MANZANAS.precio * MANZANAS.cantidad + ESPINACAS.precio * 2;

        expect(screen.getByText(formatearPrecio(subtotal + COSTO_ENVIO))).toBeTruthy();
    });

    it('informa con un mensaje cuando el carrito esta vacio', () => {
        renderCarrito();

        expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy();
        expect(screen.getByRole('link', { name: 'Ver productos' })).toBeTruthy();
        expect(document.querySelectorAll('.fila-carrito').length).toBe(0);
    });
});