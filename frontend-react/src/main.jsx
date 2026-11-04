import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { store } from './Redux/store'

// Punto de entrada: dibuja <App /> dentro del <div id="root"> de index.html.
// Provider le da a todos los componentes acceso al estado global de Redux (useSelector / useDispatch).
// BrowserRouter le permite a App mostrar una página distinta según la URL.
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
)
