import { Route, Routes } from 'react-router-dom'
import ConSesion from './components/rutas/ConSesion'
import SoloAdmin from './components/rutas/SoloAdmin'
import SoloPadrinos from './components/rutas/SoloPadrinos'
import SoloRefugio from './components/rutas/SoloRefugio'
import Layout from './components/layout/Layout'
import ProveedorMoneda from './components/proveedores/ProveedorMoneda'
import ProveedorNotificaciones from './components/proveedores/ProveedorNotificaciones'
import ProveedorSesion from './components/proveedores/ProveedorSesion'
import Admin from './views/Admin'
import Apadrinado from './views/Apadrinado'
import Catalogo from './views/Catalogo'
import Certificado from './views/Certificado'
import Cuenta from './views/Cuenta'
import Detalle from './views/Detalle'
import Gracias from './views/Gracias'
import Inicio from './views/Inicio'
import Muelle from './views/Muelle'
import NoEncontrada from './views/NoEncontrada'
import Panel from './views/Panel'
import Refugio from './views/Refugio'
import Zarpar from './views/Zarpar'

const App = () => (
  <ProveedorMoneda>
    <ProveedorSesion>
      <ProveedorNotificaciones>
        <Layout>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/animal/:id" element={<Detalle />} />
            <Route path="/muelle" element={<SoloPadrinos><Muelle /></SoloPadrinos>} />
            <Route path="/zarpar" element={<SoloPadrinos><ConSesion><Zarpar /></ConSesion></SoloPadrinos>} />
            <Route path="/gracias" element={<Gracias />} />
            <Route path="/panel" element={<SoloPadrinos><ConSesion><Panel /></ConSesion></SoloPadrinos>} />
            <Route path="/panel/:id" element={<SoloPadrinos><ConSesion><Apadrinado /></ConSesion></SoloPadrinos>} />
            <Route path="/panel/:id/certificado" element={<SoloPadrinos><ConSesion><Certificado /></ConSesion></SoloPadrinos>} />
            <Route path="/cuenta" element={<ConSesion><Cuenta /></ConSesion>} />
            <Route path="/admin" element={<SoloAdmin><Admin /></SoloAdmin>} />
            <Route path="/refugio" element={<SoloRefugio><Refugio /></SoloRefugio>} />
            <Route path="*" element={<NoEncontrada />} />
          </Routes>
        </Layout>
      </ProveedorNotificaciones>
    </ProveedorSesion>
  </ProveedorMoneda>
)

export default App