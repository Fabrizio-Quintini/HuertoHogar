/**
 * Configuracion comun del entorno de pruebas.
 *
 * 1. Matchers propios sobre el DOM.
 *    Se definen con jasmine.addMatchers en lugar de usar @testing-library/jest-dom
 *    porque los matchers de jest-dom dependen de un contexto propio de Jest
 *    (`this.equals`, `this.utils`) que Jasmine no proporciona. Escribir los
 *    matchers aqui mantiene las aserciones legibles (toBeInTheDocument y
 *    toBeDisabled) sin agregar una dependencia incompatible. Solo se definen
 *    los dos matchers que las pruebas usan realmente.
 *
 *    El contrato de Jasmine es: la fabrica recibe `matchersUtil` y debe devolver
 *    un objeto con un metodo `compare(actual, ...args)` que responda
 *    `{ pass, message }`.
 *
 * 2. Aislamiento del almacenamiento local.
 *    El carrito y el catalogo se persisten en localStorage; sin este reset una
 *    prueba puede observar el estado dejado por otra.
 */
function describir(valor) {
    if (valor === null || valor === undefined) {
        return String(valor);
    }

    if (typeof valor === 'object') {
        return `<${valor.tagName ? valor.tagName.toLowerCase() : 'objeto'}>`;
    }

    return `"${valor}"`;
}

function registrarMatchers() {
    jasmine.addMatchers({
        toBeInTheDocument: function () {
            return {
                compare: function (actual) {
                    return {
                        pass: !!actual && document.body.contains(actual),
                        message: function () {
                            return `Se esperaba que ${describir(actual)} estuviera en el documento, pero no lo estaba.`;
                        }
                    };
                }
            };
        },

        toBeDisabled: function () {
            return {
                compare: function (actual) {
                    return {
                        pass: !!actual && actual.disabled === true,
                        message: function () {
                            return `Se esperaba que ${describir(actual)} estuviera deshabilitado.`;
                        }
                    };
                }
            };
        }
    });
}

beforeEach(function () {
    // Jasmine exige registrar los matchers desde un before, no al cargar el archivo.
    registrarMatchers();
    localStorage.clear();
});

afterEach(function () {
    localStorage.clear();
});