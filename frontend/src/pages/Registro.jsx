import { useState } from 'react';

function Registro() {
    const [formulario, setFormulario] = useState({
        nombre: '',
        apellido: '',
        email: '',
        contrasena: '',
        confirmar: ''
    });

    const [errores, setErrores] = useState({});

    const cambiarCampo = (evento) => {
        const { name, value } = evento.target;

        setFormulario({
            ...formulario,
            [name]: value
        });
    };

    const enviarFormulario = (evento) => {
        evento.preventDefault();

        const nuevosErrores = {};

        if (!formulario.nombre.trim()) {
            nuevosErrores.nombre = 'Por favor ingresa tu nombre.';
        }

        if (!formulario.apellido.trim()) {
            nuevosErrores.apellido = 'Por favor ingresa tu apellido.';
        }

        if (!formulario.email.trim()) {
            nuevosErrores.email = 'Por favor ingresa un correo válido.';
        } else if (!formulario.email.includes('@')) {
            nuevosErrores.email = 'Por favor ingresa un correo válido.';
        }

        if (!formulario.contrasena.trim()) {
            nuevosErrores.contrasena =
                'La contraseña debe tener al menos 6 caracteres.';
        } else if (formulario.contrasena.length < 6) {
            nuevosErrores.contrasena =
                'La contraseña debe tener al menos 6 caracteres.';
        }

        if (!formulario.confirmar.trim()) {
            nuevosErrores.confirmar =
                'Las contraseñas no coinciden.';
        } else if (formulario.contrasena !== formulario.confirmar) {
            nuevosErrores.confirmar =
                'Las contraseñas no coinciden.';
        }

        setErrores(nuevosErrores);

        if (Object.keys(nuevosErrores).length === 0) {
            alert('¡Registro exitoso!');

            setFormulario({
                nombre: '',
                apellido: '',
                email: '',
                contrasena: '',
                confirmar: ''
            });
        }
    };

    return (
        <section className="registro">
            <h1>Crear cuenta</h1>

            <form onSubmit={enviarFormulario} noValidate>

                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">
                        Nombre
                    </label>

                    <input
                        type="text"
                        className={`form-control ${
                            errores.nombre ? 'is-invalid' : ''
                        }`}
                        id="nombre"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={cambiarCampo}
                    />

                    {errores.nombre && (
                        <div className="invalid-feedback">
                            {errores.nombre}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="apellido" className="form-label">
                        Apellido
                    </label>

                    <input
                        type="text"
                        className={`form-control ${
                            errores.apellido ? 'is-invalid' : ''
                        }`}
                        id="apellido"
                        name="apellido"
                        value={formulario.apellido}
                        onChange={cambiarCampo}
                    />

                    {errores.apellido && (
                        <div className="invalid-feedback">
                            {errores.apellido}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Correo electrónico
                    </label>

                    <input
                        type="email"
                        className={`form-control ${
                            errores.email ? 'is-invalid' : ''
                        }`}
                        id="email"
                        name="email"
                        value={formulario.email}
                        onChange={cambiarCampo}
                    />

                    {errores.email && (
                        <div className="invalid-feedback">
                            {errores.email}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="contrasena" className="form-label">
                        Contraseña
                    </label>

                    <input
                        type="password"
                        className={`form-control ${
                            errores.contrasena ? 'is-invalid' : ''
                        }`}
                        id="contrasena"
                        name="contrasena"
                        value={formulario.contrasena}
                        onChange={cambiarCampo}
                    />

                    <div className="form-text">
                        Mínimo 6 caracteres.
                    </div>

                    {errores.contrasena && (
                        <div className="invalid-feedback">
                            {errores.contrasena}
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <label htmlFor="confirmar" className="form-label">
                        Confirmar contraseña
                    </label>

                    <input
                        type="password"
                        className={`form-control ${
                            errores.confirmar ? 'is-invalid' : ''
                        }`}
                        id="confirmar"
                        name="confirmar"
                        value={formulario.confirmar}
                        onChange={cambiarCampo}
                    />

                    {errores.confirmar && (
                        <div className="invalid-feedback">
                            {errores.confirmar}
                        </div>
                    )}
                </div>

                <button type="submit" className="boton-principal">
                    Registrarse
                </button>

            </form>
        </section>
    );
}

export default Registro;