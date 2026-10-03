import { render, screen } from '@testing-library/react';
import GrillaProductos from './GrillaProductos';

const productos = [
    { codigo: 'FR001', nombre: 'Manzanas Fuji', categoria: 'Frutas Frescas', precio: 1500 },
    { codigo: 'PL001', nombre: 'Leche Entera', categoria: 'Productos Lácteos', precio: 1100 }
];

describe('GrillaProductos', () => {
    it('renderiza una tarjeta por cada producto recibido', () => {
        const { container } = render(
            <GrillaProductos productos={productos} onAgregar={() => {}} />
        );

        expect(container.querySelectorAll('.tarjeta-producto').length).toBe(productos.length);
        expect(screen.getByText('Manzanas Fuji')).toBeTruthy();
        expect(screen.getByText('Leche Entera')).toBeTruthy();
    });
});
