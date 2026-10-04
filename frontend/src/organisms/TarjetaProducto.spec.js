import { fireEvent, render, screen } from '@testing-library/react';
import TarjetaProducto from './TarjetaProducto';
import { formatearPrecio } from '../utils/formato';

const producto = {
    codigo: 'FR001',
    nombre: 'Manzanas Fuji',
    categoria: 'Frutas Frescas',
    precio: 1500
};

describe('TarjetaProducto', () => {
    it('muestra nombre, categoria y precio recibidos por props', () => {
        render(<TarjetaProducto producto={producto} onAgregar={() => {}} />);

        expect(screen.getByText('Manzanas Fuji')).toBeTruthy();
        expect(screen.getByText('Frutas Frescas')).toBeTruthy();
        expect(screen.getByText(formatearPrecio(producto.precio))).toBeTruthy();
    });

    it('entrega el producto al callback onAgregar cuando se hace clic', () => {
        const spyAgregar = jasmine.createSpy('agregar');

        render(<TarjetaProducto producto={producto} onAgregar={spyAgregar} />);
        fireEvent.click(screen.getByRole('button', { name: 'Agregar' }));

        expect(spyAgregar).toHaveBeenCalledWith(producto);
    });
});
