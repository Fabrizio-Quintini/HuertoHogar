import { fireEvent, render, screen } from '@testing-library/react';
import SelectorCantidad from './SelectorCantidad';
import { CANTIDAD_MAXIMA } from '../utils/carrito';
import { formatearPrecio } from '../utils/formato';

const MANZANAS = {
    codigo: 'FR001',
    nombre: 'Manzanas Fuji',
    categoria: 'Frutas Frescas',
    precio: 1500,
    cantidad: 3
};

function renderSelector(item = MANZANAS, onCambio = () => {}) {
    return render(<SelectorCantidad item={item} onCambio={onCambio} />);
}

const inputCantidad = () => screen.getByRole('spinbutton', { name: 'Cantidad de Manzanas Fuji' });

describe('SelectorCantidad', () => {
    it('muestra la cantidad de la linea y su subtotal', () => {
        renderSelector();

        expect(inputCantidad().value).toBe('3');
        expect(screen.getByText(formatearPrecio(4500))).toBeInTheDocument();
    });

    it('avisa la cantidad nueva al componente padre', () => {
        const spyCambio = jasmine.createSpy('onCambio');
        renderSelector(MANZANAS, spyCambio);

        fireEvent.click(screen.getByRole('button', { name: 'Agregar una unidad de Manzanas Fuji' }));
        expect(spyCambio).toHaveBeenCalledWith(MANZANAS, 4);

        fireEvent.click(screen.getByRole('button', { name: 'Quitar una unidad de Manzanas Fuji' }));
        expect(spyCambio).toHaveBeenCalledWith(MANZANAS, 2);
    });

    it('permite escribir una cantidad nueva en el input', () => {
        const spyCambio = jasmine.createSpy('onCambio');
        renderSelector(MANZANAS, spyCambio);

        fireEvent.change(inputCantidad(), { target: { value: '7' } });

        expect(inputCantidad().value).toBe('7');
        expect(spyCambio).toHaveBeenCalledWith(MANZANAS, '7');
    });

    // Regresión: al borrar el input para reescribirlo, type="number" entrega ''.
    // Number('') es 0, no NaN, así que la línea se eliminaba del carrito.
    it('no avisa un cambio cuando el usuario borra el input para reescribir', () => {
        const spyCambio = jasmine.createSpy('onCambio');
        renderSelector(MANZANAS, spyCambio);

        fireEvent.change(inputCantidad(), { target: { value: '' } });

        expect(spyCambio).not.toHaveBeenCalled();
        expect(inputCantidad().value).toBe('');
    });

    it('permite reescribir la cantidad tras haber borrado el input', () => {
        const spyCambio = jasmine.createSpy('onCambio');
        const { rerender } = renderSelector(MANZANAS, spyCambio);

        fireEvent.change(inputCantidad(), { target: { value: '' } });
        fireEvent.change(inputCantidad(), { target: { value: '5' } });

        expect(spyCambio).toHaveBeenCalledWith(MANZANAS, '5');

        rerender(
            <SelectorCantidad
                item={{ ...MANZANAS, cantidad: 5 }}
                onCambio={spyCambio}
            />
        );

        expect(inputCantidad().value).toBe('5');
    });

    it('restaura la ultima cantidad confirmada al salir del input sin escribir', () => {
        const spyCambio = jasmine.createSpy('onCambio');
        renderSelector(MANZANAS, spyCambio);

        const input = inputCantidad();
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.blur(input);

        expect(input.value).toBe('3');
    });

    it('deshabilita el boton de restar en la cantidad minima', () => {
        renderSelector({ ...MANZANAS, cantidad: 1 });

        expect(
            screen.getByRole('button', { name: 'Quitar una unidad de Manzanas Fuji' })
        ).toBeDisabled();
    });

    it('deshabilita el boton de sumar al llegar al maximo', () => {
        renderSelector({ ...MANZANAS, cantidad: CANTIDAD_MAXIMA });

        expect(
            screen.getByRole('button', { name: 'Agregar una unidad de Manzanas Fuji' })
        ).toBeDisabled();
    });

    it('normaliza una cantidad guardada fuera de rango', () => {
        renderSelector({ ...MANZANAS, cantidad: 500 });

        expect(inputCantidad().value).toBe(String(CANTIDAD_MAXIMA));
    });

    it('declara los limites minimo y maximo en el input', () => {
        renderSelector();

        expect(inputCantidad().getAttribute('min')).toBe('1');
        expect(inputCantidad().getAttribute('max')).toBe(String(CANTIDAD_MAXIMA));
    });
});