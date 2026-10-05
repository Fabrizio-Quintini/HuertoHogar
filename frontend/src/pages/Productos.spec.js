import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LayoutTienda from '../templates/LayoutTienda';
import Productos from './Productos';
import productoService from '../services/productoService';
import { CarritoProvider, CLAVE_CARRITO } from '../context/CarritoContext';

const CATALOGO_PRUEBA = [
    { codigo: 'FR001', nombre: 'Manzanas Fuji', categoria: 'Frutas Frescas', precio: 1500 },
    { codigo: 'FR002', nombre: 'Naranjas Valencia', categoria: 'Frutas Frescas', precio: 1200 },
    { codigo: 'PL001', nombre: 'Leche Entera', categoria: 'Productos Lácteos', precio: 1100 }
];

function renderCatalogo() {
    return render(
        <MemoryRouter>
            <CarritoProvider>
                <LayoutTienda>
                    <Productos />
                </LayoutTienda>
            </CarritoProvider>
        </MemoryRouter>
    );
}

describe('Pagina Productos', () => {
    beforeEach(() => {
        localStorage.clear();
        spyOn(productoService, 'listarProductos').and.returnValue(
            Promise.resolve(CATALOGO_PRUEBA)
        );
    });

it('pide los productos al servicio, renderiza una tarjeta por cada uno y permite agregarlos al carrito', async () => {
        renderCatalogo();

        expect(screen.getByText('Cargando productos...')).toBeTruthy();

        await screen.findByText('Manzanas Fuji');

        expect(productoService.listarProductos).toHaveBeenCalled();
        expect(screen.getByText('Naranjas Valencia')).toBeTruthy();
        expect(screen.getByText('Leche Entera')).toBeTruthy();
        expect(document.querySelectorAll('.tarjeta-producto').length).toBe(
            CATALOGO_PRUEBA.length
        );

        fireEvent.click(screen.getAllByRole('button', { name: 'Agregar' })[0]);

        await waitFor(() => expect(screen.getByText('Carrito (1)')).toBeTruthy());
        expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO)).length).toBe(1);
    });

    it('filtra el catalogo por categoria y por el texto de busqueda', async () => {
        const { unmount } = renderCatalogo();
        await screen.findByText('Manzanas Fuji');

        // Filtro por categoria: solo quedan los productos de esa categoria.
        fireEvent.change(screen.getByLabelText('Categoría'), {
            target: { value: 'Frutas Frescas' }
        });

        await waitFor(() => expect(screen.queryByText('Leche Entera')).toBeNull());
        expect(screen.getByText('Manzanas Fuji')).toBeTruthy();
        expect(screen.getByText('2 productos')).toBeTruthy();

        unmount();
        renderCatalogo();
        await screen.findByText('Manzanas Fuji');

        // Filtro por texto escrito en la busqueda.
        fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: 'fuji' } });

        await waitFor(() => expect(screen.queryByText('Leche Entera')).toBeNull());
        expect(screen.getByText('Manzanas Fuji')).toBeTruthy();
        expect(screen.getByText('1 producto')).toBeTruthy();
    });

    it('informa cuando el servicio falla y cuando el filtro no deja resultados', async () => {
        productoService.listarProductos.and.returnValue(
            Promise.reject(new Error('No fue posible cargar los productos'))
        );

        const { unmount } = renderCatalogo();

        expect(await screen.findByText('No fue posible cargar los productos')).toBeTruthy();
        expect(screen.queryByText('Manzanas Fuji')).toBeNull();

        unmount();
        productoService.listarProductos.and.returnValue(Promise.resolve(CATALOGO_PRUEBA));

        renderCatalogo();
        await screen.findByText('Manzanas Fuji');

        fireEvent.change(screen.getByLabelText('Buscar'), { target: { value: 'zanahoria' } });

        expect(await screen.findByText('No se encontraron productos')).toBeTruthy();
        expect(document.querySelectorAll('.tarjeta-producto').length).toBe(0);
    });
});
