import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { CarritoProvider } from '../context/CarritoContext';

describe('Navbar', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renderiza la marca y los enlaces de navegacion de la tienda', () => {
        render(
            <MemoryRouter>
                <CarritoProvider>
                    <Navbar />
                </CarritoProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('HuertoHogar')).toBeTruthy();
        expect(screen.getByText('Inicio')).toBeTruthy();
        expect(screen.getByText('Productos')).toBeTruthy();
        expect(screen.getByText('Nosotros')).toBeTruthy();
        expect(screen.getByText('Registrarse')).toBeTruthy();
        expect(screen.getByText('Carrito (0)')).toBeTruthy();
    });
});
