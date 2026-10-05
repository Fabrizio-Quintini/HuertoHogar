import { fireEvent, render, screen } from '@testing-library/react';
import SelectorCantidad from './SelectorCantidad';

const MANZANAS = {
    codigo: 'FR001',
    nombre: 'Manzanas Fuji',
    categoria: 'Frutas Frescas',
    precio: 1500,
    cantidad: 3
};

describe('SelectorCantidad', () => {
    // Regresión: al borrar el input para reescribirlo, type="number" entrega ''.
    // Number('') es 0, no NaN, así que la línea se eliminaba del carrito sin que
    // el usuario lo pidiera. El selector no debe avisar ese cambio.
    it('no avisa un cambio cuando el usuario borra el input para reescribir', () => {
        const spyCambio = jasmine.createSpy('onCambio');

        render(<SelectorCantidad item={MANZANAS} onCambio={spyCambio} />);

        const input = screen.getByRole('spinbutton', { name: 'Cantidad de Manzanas Fuji' });

        fireEvent.change(input, { target: { value: '' } });

        expect(spyCambio).not.toHaveBeenCalled();
        expect(input.value).toBe('');
    });
});