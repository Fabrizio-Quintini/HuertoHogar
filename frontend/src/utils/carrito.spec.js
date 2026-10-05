import {
    CANTIDAD_MAXIMA,
    COSTO_ENVIO,
    calcularEnvio,
    calcularSubtotal,
    calcularTotal,
    esCantidadVacia,
    normalizarCantidad,
    normalizarLinea,
    normalizarLineas,
    puedeAumentar
} from './carrito';

const MANZANAS = { codigo: 'FR001', nombre: 'Manzanas Fuji', precio: 1500, cantidad: 2 };
const ESPINACAS = { codigo: 'VR002', nombre: 'Espinacas Frescas', precio: 1100, cantidad: 1 };

describe('normalizarCantidad', () => {
    it('respeta una cantidad valida', () => {
        expect(normalizarCantidad(7)).toBe(7);
    });

    it('convierte a entero las cantidades decimales', () => {
        expect(normalizarCantidad(2.9)).toBe(2);
    });

    it('sube a 1 las cantidades menores que 1', () => {
        expect(normalizarCantidad(0)).toBe(1);
        expect(normalizarCantidad(-5)).toBe(1);
    });

    it('baja a 1 los valores no numericos', () => {
        expect(normalizarCantidad('abc')).toBe(1);
        expect(normalizarCantidad(NaN)).toBe(1);
    });

    it('trunca las cadenas numericas', () => {
        expect(normalizarCantidad('5')).toBe(5);
    });

    it('limita al maximo permitido', () => {
        expect(normalizarCantidad(CANTIDAD_MAXIMA)).toBe(CANTIDAD_MAXIMA);
        expect(normalizarCantidad(500)).toBe(CANTIDAD_MAXIMA);
        expect(normalizarCantidad(99.9)).toBe(CANTIDAD_MAXIMA);
    });

    it('trata el input vacio como 1 en vez de propagar NaN', () => {
        expect(normalizarCantidad('')).toBe(1);
    });
});

describe('esCantidadVacia', () => {
    it('reconoce el input vacio de type="number"', () => {
        expect(esCantidadVacia('')).toBe(true);
    });

    it('reconoce null y undefined', () => {
        expect(esCantidadVacia(null)).toBe(true);
        expect(esCantidadVacia(undefined)).toBe(true);
    });

    it('no confunde el cero explicito con el input vacio', () => {
        expect(esCantidadVacia(0)).toBe(false);
        expect(esCantidadVacia('0')).toBe(false);
    });

    it('no confunde una cadena no numerica con el input vacio', () => {
        expect(esCantidadVacia('abc')).toBe(false);
    });
});

describe('puedeAumentar', () => {
    it('permite aumentar mientras quede margen', () => {
        expect(puedeAumentar(1)).toBe(true);
        expect(puedeAumentar(CANTIDAD_MAXIMA - 1)).toBe(true);
    });

    it('bloquea al llegar al maximo', () => {
        expect(puedeAumentar(CANTIDAD_MAXIMA)).toBe(false);
        expect(puedeAumentar(CANTIDAD_MAXIMA + 10)).toBe(false);
    });
});

describe('calcularSubtotal', () => {
    it('suma el precio de cada linea multiplicado por su cantidad', () => {
        // 1500 x 2 + 1100 x 1 = 4100
        expect(calcularSubtotal([MANZANAS, ESPINACAS])).toBe(4100);
    });

    it('devuelve 0 para un carrito vacio', () => {
        expect(calcularSubtotal([])).toBe(0);
    });

    it('devuelve 0 cuando el carrito no es un array', () => {
        expect(calcularSubtotal(null)).toBe(0);
        expect(calcularSubtotal(undefined)).toBe(0);
        expect(calcularSubtotal({ producto: 'Manzanas' })).toBe(0);
    });

    it('normaliza la cantidad antes de multiplicar', () => {
        expect(calcularSubtotal([{ ...MANZANAS, cantidad: 0 }])).toBe(1500);
        expect(calcularSubtotal([{ ...MANZANAS, cantidad: '' }])).toBe(1500);
        expect(calcularSubtotal([{ ...MANZANAS, cantidad: 500 }])).toBe(1500 * 99);
    });

    it('trata un precio ilegible como cero', () => {
        expect(calcularSubtotal([{ codigo: 'X', precio: 'gratis', cantidad: 2 }])).toBe(0);
    });
});

describe('calcularEnvio y calcularTotal', () => {
    it('devuelve el costo de despacho fijo', () => {
        expect(calcularEnvio()).toBe(COSTO_ENVIO);
    });

    it('suma subtotal y envio', () => {
        expect(calcularTotal(2600, COSTO_ENVIO)).toBe(2600 + COSTO_ENVIO);
    });

    it('tolera valores no numericos', () => {
        expect(calcularTotal('abc', 'xyz')).toBe(0);
        expect(calcularTotal(null, undefined)).toBe(0);
    });
});

describe('normalizarLinea', () => {
    it('completa la cantidad y el precio de una linea valida', () => {
        expect(normalizarLinea({ codigo: 'FR001', precio: '1500', cantidad: '3' })).toEqual({
            codigo: 'FR001',
            nombre: '',
            precio: 1500,
            cantidad: 3
        });
    });

    it('rechaza lineas sin codigo', () => {
        expect(normalizarLinea({ nombre: 'Manzanas', precio: 1500 })).toBeNull();
    });

    it('rechaza valores que no son objetos', () => {
        expect(normalizarLinea(null)).toBeNull();
        expect(normalizarLinea('FR001')).toBeNull();
        expect(normalizarLinea([MANZANAS])).toBeNull();
    });

    it('deja el precio en cero cuando no es numerico', () => {
        expect(normalizarLinea({ codigo: 'FR001', precio: 'gratis' }).precio).toBe(0);
    });
});

describe('normalizarLineas', () => {
    it('parsea y normaliza el JSON guardado en el navegador', () => {
        const guardado = JSON.stringify([MANZANAS, ESPINACAS]);

        expect(normalizarLineas(guardado)).toEqual([MANZANAS, ESPINACAS]);
    });

    it('devuelve lista vacia cuando el contenido es un objeto y no un array', () => {
        expect(normalizarLineas(JSON.stringify({ producto: 'Manzanas Fuji' }))).toEqual([]);
    });

    it('devuelve lista vacia cuando el JSON esta corrupto', () => {
        expect(normalizarLineas('{no es json')).toEqual([]);
    });

    it('devuelve lista vacia cuando no hay nada guardado', () => {
        expect(normalizarLineas(null)).toEqual([]);
        expect(normalizarLineas('')).toEqual([]);
    });

    it('descarta las lineas corruptas y conserva las validas', () => {
        const guardado = JSON.stringify([MANZANAS, null, { sinCodigo: true }, ESPINACAS]);

        expect(normalizarLineas(guardado)).toEqual([MANZANAS, ESPINACAS]);
    });

    it('acepta un array ya parseado', () => {
        expect(normalizarLineas([MANZANAS])).toEqual([MANZANAS]);
    });
});