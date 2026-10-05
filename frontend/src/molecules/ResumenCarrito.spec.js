import { render, screen } from '@testing-library/react';
import ResumenCarrito from './ResumenCarrito';
import { formatearPrecio } from '../utils/formato';

describe('ResumenCarrito', () => {
    it('muestra el subtotal, el envio y el total recibidos por props', () => {
        render(
            <ResumenCarrito
                subtotal={2600}
                envio={1990}
                total={4590}
                totalItems={2}
                onVaciar={() => {}}
            />
        );

        expect(screen.getByText('Subtotal')).toBeTruthy();
        expect(screen.getByText('Envío')).toBeTruthy();
        expect(screen.getByText('Total')).toBeTruthy();
        expect(screen.getByText(formatearPrecio(2600))).toBeTruthy();
        expect(screen.getByText(formatearPrecio(1990))).toBeTruthy();
        expect(screen.getByText(formatearPrecio(4590))).toBeTruthy();
    });

    it('deshabilita las acciones cuando el carrito no tiene productos', () => {
        render(
            <ResumenCarrito
                subtotal={0}
                envio={1990}
                total={1990}
                totalItems={0}
                onVaciar={() => {}}
            />
        );

        expect(screen.getByRole('button', { name: 'Vaciar carrito' }).disabled).toBe(true);
        expect(screen.getByRole('button', { name: 'Finalizar compra' }).disabled).toBe(true);
    });
});