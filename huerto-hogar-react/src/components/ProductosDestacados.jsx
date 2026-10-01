import React from 'react';

export function ProductosDestacados() {
    return (
        <section className="productos-destacados">
            <h2>Productos destacados</h2>

            <div className="container text-center">
                <div className="row">

                    <div className="col-12 col-md-4">
                        <div className="tarjeta-producto">
                            <img
                                src="/img/MANZANA-FUJI.jpg"
                                alt="MANZANA-FUJI"
                                className="imagen-producto"
                            />
                            <h3>Manzanas Fuji</h3>
                            <p>Frutas Frescas</p>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="tarjeta-producto">
                            <img
                                src="/img/naranja-valencia.webp"
                                alt="naranja-valencia"
                                className="imagen-producto"
                            />
                            <h3>Naranjas Valencia</h3>
                            <p>Frutas Frescas</p>
                        </div>
                    </div>

                    <div className="col-12 col-md-4">
                        <div className="tarjeta-producto">
                            <img
                                src="/img/platano.jpg"
                                alt="platano"
                                className="imagen-producto"
                            />
                            <h3>Plátanos Cavendish</h3>
                            <p>Frutas Frescas</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}