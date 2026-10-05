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
    it('devuelve siempre un entero entre 1 y el maximo permitido', () => {
        // Una cantidad ya valida se respeta tal cual.
        expect(normalizarCantidad(7)).toBe(7);

        // Los decimales se truncan hacia abajo.
        expect(normalizarCantidad(2.9)).toBe(2);

        // Las cadenas numericas se convierten.
        expect(normalizarCantidad('5')).toBe(5);

        // Todo lo que no llega a 1 se sube a 1, incluidos los valores no numericos.
        expect(normalizarCantidad(0)).toBe(1);
        expect(normalizarCantidad(-5)).toBe(1);
        expect(normalizarCantidad('abc')).toBe(1);
        expect(normalizarCantidad(NaN)).toBe(1);

        // El input vacio de type="number" se trata como 1 en vez de propagar NaN.
        expect(normalizarCantidad('')).toBe(1);

        // El tope se aplica sin pasarse.
        expect(normalizarCantidad(CANTIDAD_MAXIMA)).toBe(CANTIDAD_MAXIMA);
        expect(normalizarCantidad(500)).toBe(CANTIDAD_MAXIMA);
        expect(normalizarCantidad(99.9)).toBe(CANTIDAD_MAXIMA);
    });
});

describe('esCantidadVacia', () => {
    it('reconoce el input vacio sin confundirlo con el cero explicito', () => {
        // type="number" entrega '' al borrar para reescribir, y ese caso no
        // debe interpretarse como "quedarse sin unidades".
        expect(esCantidadVacia('')).toBe(true);
        expect(esCantidadVacia(null)).toBe(true);
        expect(esCantidadVacia(undefined)).toBe(true);

        // El cero del usuario es una cantidad real, no un input vacio.
        expect(esCantidadVacia(0)).toBe(false);
        expect(esCantidadVacia('0')).toBe(false);
        expect(esCantidadVacia('abc')).toBe(false);
    });
});

describe('puedeAumentar', () => {
    it('solo permite aumentar mientras quede margen antes del tope', () => {
        expect(puedeAumentar(1)).toBe(true);
        expect(puedeAumentar(CANTIDAD_MAXIMA - 1)).toBe(true);

        expect(puedeAumentar(CANTIDAD_MAXIMA)).toBe(false);
        expect(puedeAumentar(CANTIDAD_MAXIMA + 10)).toBe(false);
    });
});

describe('calcularSubtotal', () => {
    it('suma el precio de cada linea por su cantidad, normalizando los valores', () => {
        // 1500 x 2 + 1100 x 1 = 4100
        expect(calcularSubtotal([MANZANAS, ESPINACAS])).toBe(4100);

        // Un carrito vacio o con una forma inesperada no rompe la operacion.
        expect(calcularSubtotal([])).toBe(0);
        expect(calcularSubtotal(null)).toBe(0);
        expect(calcularSubtotal(undefined)).toBe(0);
        expect(calcularSubtotal({ producto: 'Manzanas' })).toBe(0);

        // La cantidad se normaliza antes de multiplicar, en vez de propagar NaN.
        expect(calcularSubtotal([{ ...MANZANAS, cantidad: 0 }])).toBe(1500);
        expect(calcularSubtotal([{ ...MANZANAS, cantidad: '' }])).toBe(1500);
        expect(calcularSubtotal([{ ...MANZANAS, cantidad: 500 }])).toBe(1500 * 99);

        // Un precio ilegible pesa cero en vez de arruinar toda la suma.
        expect(calcularSubtotal([{ codigo: 'X', precio: 'gratis', cantidad: 2 }])).toBe(0);
    });
});

describe('calcularEnvio y calcularTotal', () => {
    it('devuelve el costo de despacho fijo y lo suma al subtotal', () => {
        expect(calcularEnvio()).toBe(COSTO_ENVIO);
        expect(calcularTotal(2600, COSTO_ENVIO)).toBe(2600 + COSTO_ENVIO);

        // Tolera valores no numericos devolviendo un total utilizable.
        expect(calcularTotal('abc', 'xyz')).toBe(0);
        expect(calcularTotal(null, undefined)).toBe(0);
    });
});

describe('normalizarLinea', () => {
    it('completa una linea valida y descarta las que no son utilizables', () => {
        expect(normalizarLinea({ codigo: 'FR001', precio: '1500', cantidad: '3' })).toEqual({
            codigo: 'FR001',
            nombre: '',
            precio: 1500,
            cantidad: 3
        });

        // Sin codigo la linea no se puede identificar y se descarta.
        expect(normalizarLinea({ nombre: 'Manzanas', precio: 1500 })).toBeNull();

        // Tampoco se admiten valores que no son objetos.
        expect(normalizarLinea(null)).toBeNull();
        expect(normalizarLinea('FR001')).toBeNull();
        expect(normalizarLinea([MANZANAS])).toBeNull();

        // Un precio ilegible queda en cero para no romper los calculos.
        expect(normalizarLinea({ codigo: 'FR001', precio: 'gratis' }).precio).toBe(0);
    });
});

describe('normalizarLineas', () => {
    it('parsea el carrito guardado conservando solo las lineas validas', () => {
        const guardado = JSON.stringify([MANZANAS, null, { sinCodigo: true }, ESPINACAS]);

        expect(normalizarLineas(guardado)).toEqual([MANZANAS, ESPINACAS]);
        expect(normalizarLineas(JSON.stringify([MANZANAS, ESPINACAS]))).toEqual([
            MANZANAS,
            ESPINACAS
        ]);

        // Un almacen corrupto o con forma de objeto en vez de array no debe
        // propagar el error: la app quedaria en pantalla blanca.
        expect(normalizarLineas('{no es json')).toEqual([]);
        expect(normalizarLineas(JSON.stringify({ producto: 'Manzanas Fuji' }))).toEqual([]);
        expect(normalizarLineas(null)).toEqual([]);
        expect(normalizarLineas('')).toEqual([]);

        // Tambien acepta un array ya parseado.
        expect(normalizarLineas([MANZANAS])).toEqual([MANZANAS]);
    });
});