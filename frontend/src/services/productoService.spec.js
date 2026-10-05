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

    // Regresión: un almacen corrupto con forma de objeto hacia fallar
    // guardados.map() y dejaba el catalogo en blanco.
    it('resiembra el almacen cuando lo guardado no es un array', async () => {
        localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify({ producto: 'Manzana' }));

        const productos = await productoService.listarProductos();

        expect(Array.isArray(productos)).toBe(true);
        expect(productos.length).toBe(productosIniciales.length);
    });

    it('resiembra el almacen cuando el JSON guardado esta corrupto', async () => {
        localStorage.setItem(CLAVE_PRODUCTOS, 'no soy json');

        const productos = await productoService.listarProductos();

        expect(productos.length).toBe(productosIniciales.length);
    });

    it('filtra por categoria', async () => {
        const frutas = await productoService.listarPorCategoria('Frutas Frescas');

        expect(frutas.length).toBeGreaterThan(0);
        expect(frutas.every((producto) => producto.categoria === 'Frutas Frescas')).toBe(true);
    });

    it('devuelve una lista vacia al filtrar por una categoria inexistente', async () => {
        const productos = await productoService.listarPorCategoria('Categoria Inventada');

        expect(productos).toEqual([]);
    });

    it('reinicia los datos del almacen', async () => {
        await productoService.crearProducto({
            codigo: 'ZZ999',
            nombre: 'Producto de prueba',
            categoria: 'Frutas Frescas',
            precio: 100
        });

        const productos = await productoService.reiniciarDatos();

        expect(productos.length).toBe(productosIniciales.length);
        expect(productos.find((producto) => producto.codigo === 'ZZ999')).toBeUndefined();
    });

    it('recupera la imagen original de un producto guardado', async () => {
        await productoService.actualizarProducto('FR001', { imagen: '/img/rota.jpg' });

        const productos = await productoService.listarProductos();
        const manzana = productos.find((producto) => producto.codigo === 'FR001');

        expect(manzana.imagen).toBe(productosIniciales[0].imagen);
    });
});
