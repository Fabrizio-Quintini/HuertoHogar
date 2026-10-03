import productosIniciales from '../data/productos';
import productoService, { CLAVE_PRODUCTOS } from './productoService';

describe('productoService', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('siembra el almacen con los productos iniciales cuando esta vacio', async () => {
        const productos = await productoService.listarProductos();

        expect(productos.length).toBe(productosIniciales.length);
        expect(JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS)).length).toBe(
            productosIniciales.length
        );
    });

    it('crea, actualiza y elimina productos sobre el almacen del navegador', async () => {
        const nuevoProducto = {
            codigo: 'FR004',
            nombre: 'Ciruelas',
            categoria: 'Frutas Frescas',
            precio: 1300
        };

        const creados = await productoService.crearProducto(nuevoProducto);
        expect(creados.length).toBe(productosIniciales.length + 1);
        expect(creados[creados.length - 1].codigo).toBe('FR004');

        const actualizados = await productoService.actualizarProducto('FR004', { precio: 1500 });
        expect(actualizados.find((producto) => producto.codigo === 'FR004').precio).toBe(1500);

        const restantes = await productoService.eliminarProducto('FR004');
        expect(restantes.length).toBe(productosIniciales.length);
        expect(JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS)).length).toBe(
            productosIniciales.length
        );
    });
});
