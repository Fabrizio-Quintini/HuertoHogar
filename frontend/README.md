# HuertoHogar — Frontend React

Tienda online de productos frescos migrada desde HTML/CSS/JS estático a una
aplicación web con React.

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | React 18 (function components + hooks) |
| Build | Create React App 5 (`react-scripts`) |
| Estilos / responsividad | Bootstrap 5 + `react-bootstrap` |
| Enrutamiento | `react-router-dom` 5 |
| Estado global | Context API (`CarritoContext`) |
| Pruebas | Jasmine 5 + Karma 6 + React Testing Library |
| Cobertura | `karma-coverage` + `babel-plugin-istanbul` |

## Estructura

El proyecto sigue **Atomic Design**, separando cada componente según su
complejidad y su número de responsabilidades:

```
src/
├── atoms/       Boton, BadgeCategoria, EtiquetaPrecio
├── molecules/   BarraFiltros, CampoBusqueda, ResumenCarrito,
│                SelectorCantidad, SelectorCategoria
├── organisms/   Navbar, Footer, GrillaProductos, TarjetaProducto, FilaCarrito
├── templates/   LayoutTienda (Navbar + main + Footer)
├── pages/       Inicio, Productos, Carrito, Nosotros, Registro, Placeholder
├── context/     CarritoContext (estado global del carrito)
├── hooks/       useProductos (carga de datos)
├── services/    productoService (acceso a datos)
├── utils/       carrito (lógica de precios), formato (moneda)
├── data/        productos (catálogo inicial)
└── test/        setup (entorno común de pruebas)
```

---

# 1. Framework de JavaScript moderno y diseño responsivo

## Cómo se usó React

### Componentes funcionales, props y estado

Todos los componentes son funciones. Los **presentacionales** (`atoms`,
`molecules`, `organisms`) no tienen estado propio: reciben datos por `props` y
notifican interacciones mediante callbacks. Esto los hace fácilmente
reutilizables y deterministas, que es justo lo que permite probarlos sin
montar toda la aplicación.

```jsx
// organisms/TarjetaProducto.jsx — presentacional puro
function TarjetaProducto({ producto, onAgregar }) {
    return (
        <Card className="tarjeta-producto h-100">
            <Card.Body>
                <BadgeCategoria>{producto.categoria}</BadgeCategoria>
                <Card.Title as="h3">{producto.nombre}</Card.Title>
                <EtiquetaPrecio valor={producto.precio} />
            </Card.Body>
            <Card.Footer>
                <Boton onClick={() => onAgregar(producto)}>Agregar</Boton>
            </Card.Footer>
        </Card>
    );
}
```

Los `atoms` agregan **valores por defecto a las props** para permitir
personalización sin repetir configuración:

```jsx
// atoms/Boton.jsx
function Boton({
    children,
    variant = 'success',   // por defecto
    size,                   // opcional
    disabled = false,
    ariaLabel,
    onClick,
    className = ''
}) { /* ... */ }
```

Así `ResumenCarrito` usa `<Boton variant="outline-danger" size="sm">` sin
tocar el átomo.

### Estado local con hooks

El estado se usa donde corresponde:

- **`pages/Productos.jsx`** — `useState` para `categoria` y `busqueda`,
  `useMemo` para el filtrado y `useCallback` para los manejadores, evitando
  rehacer el cálculo en cada render.
- **`pages/Registro.jsx`** — `useState` para el formulario y para el mapa de
  errores de validación.
- **`molecules/SelectorCantidad.jsx`** — `useState` como *borrador* del input.
  Ver la sección de pruebas: este detalle nació de un defecto real.

### Estado global con Context API

El carrito es el único dato que cruza toda la aplicación ( navbar, catálogo y
página de carrito). Se resolvió con `CarritoContext`, que expone una única API
pública y encapsula la lógica de líneas y totales:

```jsx
const { items, totalItems, subtotal, envio, total,
        agregar, actualizarCantidad, eliminar, vaciar } = useCarrito();
```

El cálculo vive en funciones puras (`utils/carrito.js`), fuera del componente,
de modo que el provider solo orquesta y la lógica se prueba sin renderizar nada.

Además `useCarrito` **falla explícitamente** si se usa fuera del provider, en
lugar de devolver `undefined` y romper más tarde:

```js
if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de un CarritoProvider');
}
```

### Carga de datos con un hook reutilizable

`hooks/useProductos.js` encapsula el estado asíncrono (`productos`, `cargando`,
`error`, `recargar`) y lo expone a cualquier componente. El componente de página
solo decide qué renderizar en cada caso.

### Enrutamiento

`App.js` define las rutas y compone `LayoutTienda` (navbar + contenido + footer)
como plantilla compartida, evitando duplicar la estructura en cada página.

---

## Cómo se implementó el diseño responsivo con Bootstrap

El sitio se adapta en cuatro rangos. Los puntos de corte son los de Bootstrap:
`xs < 576px`, `sm ≥ 576px`, `md ≥ 768px`, `lg ≥ 992px`.

### 1. Grilla de productos: 1 → 3 columnas

```jsx
// organisms/GrillaProductos.jsx
<Row xs={1} md={3} className="g-4">
```

- **Móvil (`xs`)**: una tarjeta por fila, lectura vertical cómoda.
- **Tablet y desktop (`md` y superior)**: tres columnas.
- `g-4` agrega gutters consistentes entre tarjetas.

### 2. Navbar colapsable

```jsx
// organisms/Navbar.jsx
<NavbarBootstrap expand="lg">
    <NavbarBootstrap.Toggle aria-controls="navbar-principal" />
    <NavbarBootstrap.Collapse id="navbar-principal">
```

Por debajo de `lg` (992px) los enlaces se ocultan detrás del botón hamburguesa;
desde `lg` se muestran en línea. `Container fluid` evita que el contenido
quede pegado a los bordes en pantallas grandes.

### 3. Secciones de la página de inicio y de nosotros

```jsx
<div className="col-12 col-md-4">   <!-- 3 columnas en desktop, 1 en móvil -->
<div className="col-12 col-md-6">   <!-- 2 columnas: Misión / Visión -->
```

Las tarjetas de ciudades y los productos destacados se apilan en móvil y se
distribuyen en `md`.

### 4. Tabla del carrito → tarjetas en móvil

Es el caso más delicado, porque una tabla de cuatro columnas no cabe en un
teléfono. En `index.css`, dentro de `@media (max-width: 767px)`:

```css
.tabla-carrito thead { display: none; }

.tabla-carrito,
.tabla-carrito tbody,
.tabla-carrito tr,
.tabla-carrito td { display: block; width: 100%; }

.tabla-carrito td {
    display: flex;
    justify-content: space-between;
}

/* Reutiliza el atributo data-label como encabezado de cada celda */
.tabla-carrito td::before {
    content: attr(data-label);
    text-transform: uppercase;
}
```

Cada `<td>` de `FilaCarrito` declara su encabezado con `data-label`, así que
la tabla se convierte en una lista de tarjetas apiladas sin duplicar markup:

```jsx
<td data-label="Producto">…</td>
<td data-label="Cantidad">…</td>
<td data-label="Subtotal">…</td>
<td data-label="Acciones">…</td>
```

Además, el resumen de la compra pasa de alineado a la derecha a ocupar el
ancho completo, y la barra de filtros usa `flex-wrap` para que los controles
salten de línea cuando no caben.

---

# 2. Pruebas unitarias con Jasmine y Karma

## Herramientas y estructura

- **Jasmine** como framework de especificaciones (`describe` / `it` / `expect`).
- **Karma** como runner: levanta Chrome Headless, compila cada `.spec.js` con
  webpack y publica los resultados.
- **React Testing Library** para renderizar componentes y consultarlos como lo
  haría una persona (`getByRole`, `getByLabelText`), en vez de buscar clases CSS.

```
frontend/karma.conf.js     configuración del runner
frontend/src/test/setup.js  matchers propios y reseteo de localStorage
frontend/src/**/*.spec.js   11 archivos de pruebas
```

## Qué se prueba y cómo

| Archivo | Pruebas | Foco |
| --- | --- | --- |
| `utils/carrito.spec.js` | 31 | Lógica pura: normalización de cantidades, subtotal, envío, total, saneado de datos |
| `context/CarritoContext.spec.js` | 11 | Agregar, acumular cantidad, eliminar, vaciar, persistencia, datos corruptos |
| `molecules/SelectorCantidad.spec.js` | 10 | Límites 1–99, input editable, borrador, deshabilitado de botones |
| `services/productoService.spec.js` | 8 | Siembra, alta, edición, baja, filtrado, reinicio, recuperación de imagen |
| `pages/Productos.spec.js` | 6 | Carga, filtro por categoría, búsqueda, carrito, error, sin resultados |
| `pages/Carrito.spec.js` | 3 | Listado, totales con envío, carrito vacío |
| `molecules/ResumenCarrito.spec.js` | 2 | Render de importes y acciones deshabilitadas sin productos |
| `organisms/FilaCarrito.spec.js` | 2 | Render de la línea y avisos al padre |
| `organisms/TarjetaProducto.spec.js` | 2 | Render y callback `onAgregar` |
| `organisms/GrillaProductos.spec.js` | 1 | Una tarjeta por producto |
| `organisms/Navbar.spec.js` | 1 | Enlaces y contador del carrito |

### Verificación de la lógica

La lógica de negocio se prueba como función pura, sin DOM:

```js
it('limita al maximo permitido', () => {
    expect(normalizarCantidad(500)).toBe(CANTIDAD_MAXIMA);
});

it('normaliza la cantidad antes de multiplicar', () => {
    expect(calcularSubtotal([{ ...MANZANAS, cantidad: 500 }])).toBe(1500 * 99);
});
```

### Verificación del comportamiento y manipulación del DOM

Se comprueba el árbol renderizado, los valores de los inputs y el estado
habilitado/deshabilitado de los controles:

```js
it('deshabilita el boton de restar en la cantidad minima', () => {
    renderSelector({ ...MANZANAS, cantidad: 1 });

    expect(
        screen.getByRole('button', { name: 'Quitar una unidad de Manzanas Fuji' })
    ).toBeDisabled();
});
```

Y se verifican los avisos hacia el componente padre con `jasmine.createSpy`:

```js
const spyCantidad = jasmine.createSpy('onCantidadChange');
fireEvent.click(screen.getByRole('button', { name: 'Agregar una unidad de Manzanas Fuji' }));
expect(spyCantidad).toHaveBeenCalledWith(item, 3);
```

### Matchers propios

`@testing-library/jest-dom` no se usa porque sus matchers dependen de un
contexto interno de Jest (`this.equals`, `this.utils`) que Jasmine no
proporciona. En su lugar, `src/test/setup.js` define cuatro matchers propios
con `jasmine.addMatchers`, en el formato que Jasmine espera (la fábrica recibe
`matchersUtil` y devuelve un objeto con `compare`):

```js
toBeInTheDocument, toBeDisabled, toBeEnabled, toHaveTextContent
```

---

# 3. Proceso de testeo

## 3.1 Configuración del entorno de pruebas

`karma.conf.js` concentra toda la configuración:

- **`frameworks: ['jasmine']`** — motor de especificaciones.
- **`files`** — `src/**/*.spec.js` más `src/test/setup.js`. El archivo de
  entorno se declara **antes** y se preprocesa con webpack, para que quede en
  el mismo bundle que las pruebas.
- **`preprocessors`** — `webpack` para transpilar JSX, `coverage` para medir.
- **`webpack`** — `babel-loader` con `@babel/preset-env` y
  `@babel/preset-react` (`runtime: 'automatic'`, sin importar React en cada
  archivo). `style-loader` + `css-loader` permiten importar CSS en las pruebas.
- **`client.jasmine.random: false`** — orden de ejecución determinista, para
  que un fallo sea reproducible.
- **`browsers: ['ChromeHeadlessNoSandbox']`** — Chrome headless con
  `--no-sandbox`, necesario en contenedores y en CI.
- **`singleRun: true`** — una ejecución y salida, apta para CI.

`src/test/setup.js` centraliza dos tareas:

1. Registra los matchers de DOM ( Jasmine exige registrarlos desde un `before`).
2. Limpia `localStorage` en `beforeEach` y `afterEach`. Es indispensable:
   el carrito y el catálogo persisten ahí, y sin el reseteo una prueba puede
   observar el estado dejado por otra.

## 3.2 Uso de mocks y datos de prueba

**Spies para aislar el servicio de datos.** Las pruebas de página no tocan
`localStorage` ni esperan el retardo real: reemplazan el método del servicio por
un spy que devuelve una promesa resuelta con un catálogo controlado.

```js
// pages/Productos.spec.js
beforeEach(() => {
    spyOn(productoService, 'listarProductos').and.returnValue(
        Promise.resolve(CATALOGO_PRUEBA)
    );
});
```

**Espías para verificar callbacks.** `jasmine.createSpy` permite comprobar que un
componente notifica al padre sin renderizar el padre real.

**Promesas rechazadas para el camino de error.** Para probar el estado de
fallo no hace falta romper `localStorage`: se invierte el retorno del spy.

```js
it('muestra un mensaje de error cuando el servicio no puede responder', async () => {
    productoService.listarProductos.and.returnValue(
        Promise.reject(new Error('No fue posible cargar los productos'))
    );

    renderCatalogo();

    expect(await screen.findByText('No fue posible cargar los productos')).toBeInTheDocument();
});
```

**Estado inicial por `localStorage`.** Las pruebas del carrito parten de un
carrito precargado, lo que permite verificar la restauración sin simular clics.

```js
localStorage.setItem(CLAVE_CARRITO, JSON.stringify([MANZANAS, ESPINACAS]));
```

## 3.3 Análisis de resultados

### Cobertura

La cobertura se instrumenta con `babel-plugin-istanbul` en el `babel-loader`, de
modo que cada módulo queda atribuído a su archivo original:

```js
plugins: [['babel-plugin-istanbul', {
    exclude: ['**/*.spec.js', 'src/test/**', 'src/index.js']
}]]
```

Se excluyen los propios archivos de prueba: se mide el código de la aplicación,
no el andamiaje que la verifica.

> **Nota técnica.** Con `karma-webpack` 5 la instrumentación no se puede hacer
> sobre el bundle, porque esa versión no entrega los *source maps* que
> permitirían reasignar la cobertura a los módulos originales (el resultado
> medía solo los `.spec.js`). Por eso se instrumenta en Babel. Además se
> configuró un instrumentador inerte para los `.spec.js`, que de otro modo
> dejaría una entrada espuria por cada archivo de prueba.

El reporte se genera en `coverage/html/index.html`.

### Umbrales

`karma.conf.js` define un mínimo que **hace fallar la ejecución** si la
cobertura baja del nivel acordado:

```js
check: {
    global: {
        statements: 75,
        branches: 70,
        functions: 75,
        lines: 75
    }
}
```

Verificado: al subir el umbral a 99.9 %, Karma devuelve código de salida 1 y
CI falla.

```text
ERROR [coverage]: Coverage for statements (98.04%) does not meet global threshold (99.9%)
```

### Automatización en CI

`.github/workflows/test.yml` ejecuta `npm ci`, `npm run lint` y `npm test` en
cada push y pull request que toque `frontend/`, y publica el informe HTML de
cobertura como artefacto. Como el umbral se comprueba en el mismo paso, una
regresión de cobertura rompe la integración en lugar de pasar inadvertida.

---

# Resultados

```text
TOTAL: 77 SUCCESS   (11 archivos de pruebas)
```

| Indicador | Cobertura | Umbral |
| --- | --- | --- |
| Statements | 98.04 % (201/205) | 75 % |
| Branches | 94.31 % (83/88) | 70 % |
| Functions | 98.93 % (93/94) | 75 % |
| Lines | 97.96 % (193/197) | 75 % |

`npm run lint` sin errores.

### Cobertura por módulo

| Archivo | Statements | Branches | Functions |
| --- | --- | --- | --- |
| `utils/carrito.js` | 100 % | 100 % | 100 % |
| `services/productoService.js` | 100 % | 100 % | 100 % |
| `molecules/SelectorCantidad.jsx` | 100 % | 100 % | 100 % |
| `organisms/TarjetaProducto.jsx` | 100 % | — | 100 % |
| `organisms/GrillaProductos.jsx` | 100 % | — | 100 % |
| `organisms/Navbar.jsx` | 100 % | — | 100 % |
| `organisms/FilaCarrito.jsx` | 100 % | — | 100 % |
| `molecules/ResumenCarrito.jsx` | 100 % | — | 100 % |
| `atoms/*.jsx` | 100 % | 100 % | 100 % |
| `hooks/useProductos.js` | 100 % | 75 % | 100 % |
| `pages/Productos.jsx` | 96.8 % | 90 % | 100 % |
| `context/CarritoContext.js` | 94.3 % | 85.7 % | 100 % |
| `pages/Carrito.jsx` | 85.7 % | 100 % | 75 % |

### Limitación conocida

Estos archivos **no aparecen en el reporte** porque ninguna prueba los importa,
y por lo tanto no están medidos:

`App.js`, `index.js`, `pages/Inicio.jsx`, `pages/Nosotros.jsx`,
`pages/Registro.jsx`, `pages/Placeholder.jsx`.

`pages/Registro.jsx` es la brecha más relevante: contiene unas 30 líneas de
validación de formulario (campos obligatorios, formato de correo, contraseña de
mínimo 6 caracteres y confirmación) que todavía no tienen pruebas.

---

# Defectos encontrados por las pruebas

Las pruebas no solo confirman que el código funciona: revelaron dos defectos
reales que la revisión manual no había detectado.

### 1. El carrito borraba el producto al vaciar el input de cantidad

Un `<input type="number">` entrega `''` cuando el usuario selecciona el valor
para reemplazarlo. El código convertible `Number('')` **es `0`, no `NaN`**, así
que la validación lo interpretaba como "quedarse sin unidades" y eliminaba la
línea del carrito.

Reproducción registrada durante la revisión:

```text
>>> lineas tras borrar el input: 0      ← el producto desapareció
>>> valor del input tras el evento: '3' ← y el campo rebotó al valor viejo
```

Solución: `esCantidadVacia()` distingue `''` de `0`, y `SelectorCantidad` usa
un borrador local (`useState`) para que el campo permita escribir. Ambos casos
quedan cubiertos por pruebas de regresión.

### 2. `localStorage` corrupto dejaba la aplicación en pantalla blanca

`leerCarritoGuardado` validaba el `try/catch` del JSON pero no la forma del
dato. Con un objeto en lugar de un array (por ejemplo, datos de una versión
anterior) la aplicación completa fallaba:

```text
Uncaught TypeError: items.reduce is not a function thrown
```

No existía un error boundary, así que el usuario veía una pantalla en blanco.
`calcularSubtotal` sí se defendía con `Array.isArray`, pero el provider no.

Solución: `normalizarLineas()` valida y sanea cada línea al leer, descartando
las inservibles y conservando las válidas. El mismo defecto existía en
`productoService.leerDelAlmacen` y se corrigió ahí también.

Ambos casos están cubiertos por pruebas de regresión que fallan si el defecto
vuelve a aparecer.

---

# Comandos

```bash
npm install        # instalar dependencias
npm start          # servidor de desarrollo en http://localhost:3000
npm run build      # build de producción
npm run lint       # análisis estático (ESLint)
npm test           # pruebas unitarias + cobertura, una ejecución
npm run test:watch # pruebas en modo watch
```

Tras `npm test`, el informe de cobertura queda en `coverage/html/index.html`.

> `npm test` requiere **Google Chrome** instalado, porque Karma ejecuta las
> pruebas en un navegador real (headless) para poder verificar el DOM y el
> comportamiento de eventos.