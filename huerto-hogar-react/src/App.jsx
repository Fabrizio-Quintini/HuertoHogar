import React from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProductosDestacados } from './components/ProductosDestacados'
import { SobreNosotros } from './components/SobreNosotros'
import { Footer } from './components/Footer'
import './base.css'

function App() {
  return (
      <div>
        <Header />
        <main>
          <Hero />
          <ProductosDestacados />
          <SobreNosotros />
        </main>
        <Footer />
      </div>
  )
}

export default App