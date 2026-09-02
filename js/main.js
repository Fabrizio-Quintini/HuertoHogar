const form = document.getElementById("form-registro");

form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let valido = true;

    const campos = [
        document.getElementById("nombre"),
        document.getElementById("apellido"),
        document.getElementById("email"),
        document.getElementById("contrasena"),
        document.getElementById("confirmar")
    ];

    campos.forEach(function (campo) {
        campo.classList.remove("is-invalid");
    });

    campos.forEach(function (campo) {
        if (!campo.value.trim()) {
            campo.classList.add("is-invalid");
            valido = false;
        }
    });

    const email = document.getElementById("email");
    if (email.value.trim() && !email.value.includes("@")) {
        email.classList.add("is-invalid");
        valido = false;
    }

    const contrasena = document.getElementById("contrasena");
    const confirmar = document.getElementById("confirmar");

    if (contrasena.value.trim() && contrasena.value.length < 6) {
        contrasena.classList.add("is-invalid");
        valido = false;
    }

    if (confirmar.value.trim() && contrasena.value !== confirmar.value) {
        confirmar.classList.add("is-invalid");
        valido = false;
    }

    if (valido) {
        alert("¡Registro exitoso!");
        form.reset();
    }
});
