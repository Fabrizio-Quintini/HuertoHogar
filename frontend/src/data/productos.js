export const CATEGORIA_TODAS = 'Todas';

export const CATEGORIAS = [
    'Frutas Frescas',
    'Verduras Orgánicas',
    'Productos Orgánicos',
    'Productos Lácteos'
];

const productosIniciales = [
    {
        codigo: 'FR001',
        nombre: 'Manzanas Fuji',
        categoria: 'Frutas Frescas',
        precio: 1500,
        imagen: '/img/MANZANA-FUJI.jpg'
    },
    {
        codigo: 'FR002',
        nombre: 'Naranjas Valencia',
        categoria: 'Frutas Frescas',
        precio: 1200,
        imagen: '/img/naranja-valencia.webp'
    },
    {
        codigo: 'FR003',
        nombre: 'Plátanos Cavendish',
        categoria: 'Frutas Frescas',
        precio: 990,
        imagen: '/img/platano.jpg'
    },
    {
        codigo: 'VR001',
        nombre: 'Zanahorias Orgánicas',
        categoria: 'Verduras Orgánicas',
        precio: 800,
        imagen:'/img/zanahoria.jpg'
    },
    {
        codigo: 'VR002',
        nombre: 'Espinacas Frescas',
        categoria: 'Verduras Orgánicas',
        precio: 1100,
        imagen:'/img/espinaca.jpg'
    },
    {
        codigo: 'VR003',
        nombre: 'Pimientos Tricolores',
        categoria: 'Verduras Orgánicas',
        precio: 1300,
        imagen:'/img/pimenton.jpg'
    },
    {
        codigo: 'PO001',
        nombre: 'Miel Orgánica',
        categoria: 'Productos Orgánicos',
        precio: 4500,
        imagen:'/img/miel.jpg'
    },
    {
        codigo: 'PO003',
        nombre: 'Quinua Orgánica',
        categoria: 'Productos Orgánicos',
        precio: 3200,
        imagen: '/img/quinoa.jpg'
    },
    {
        codigo: 'PL001',
        nombre: 'Leche Entera',
        categoria: 'Productos Lácteos',
        precio: 1100,
        imagen: '/img/leche.jpg'
    }
];

export default productosIniciales;
