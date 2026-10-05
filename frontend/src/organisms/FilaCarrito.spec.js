import { fireEvent, render, screen } from '@testing-library/react';
import FilaCarrito from './FilaCarrito';

const item = {
    codigo: 'FR001',
    nombre: 'Manzanas Fuji',
    categoria: 'Frutas Frescas',
    precio: 1500,
    imagen: '/img/MANZANA-FUJI.jpg',
    cantidad: 2
};

/**
 * FilaCarrito devuelve un <tr>, asi que necesita una tabla que lo contenga para
 * no romper las reglas de anidamiento del DOM.
 */
function renderFila(props) {
    return render(
        <table>
            <tbody>
                <FilaCarrito
                    item={item}
                    onCantidadChange={() => {}}
                    onEliminar={() => {}}
                    {...props}
                />
            </tbody>
        </table>
    );
}

describe('FilaCarrito', () => {
    it('renderiza el producto y el subtotal de la linea', () => {
        renderFila();

        expect(screen.getByText('Manzanas Fuji')).toBeTruthy();
        expect(screen.getByText('Frutas Frescas')).toBeTruthy();
        expect(screen.getByRole('img', { name: 'Manzanas Fuji' })).toBeTruthy();
        expect(
            screen.getByRole('spinbutton', { name: 'Cantidad de Manzanas Fuji' }).value
        ).toBe('2');
    });

    it('avisa la nueva cantidad y la eliminacion de la linea al componente padre', () => {
        const spyCantidad = jasmine.createSpy('onCantidadChange');
        const spyEliminar = jasmine.createSpy('onEliminar');

        renderFila({ onCantidadChange: spyCantidad, onEliminar: spyEliminar });

        fireEvent.click(
            screen.getByRole('button', { name: 'Agregar una unidad de Manzanas Fuji' })
        );
        expect(spyCantidad).toHaveBeenCalledWith(item, 3);

        fireEvent.click(screen.getByRole('button', { name: 'Eliminar Manzanas Fuji del carrito' }));
        expect(spyEliminar).toHaveBeenCalledWith(item);
    });
});