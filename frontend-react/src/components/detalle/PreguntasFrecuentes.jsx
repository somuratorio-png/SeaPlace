import { useState } from 'react'
import Icono from '../comunes/Icono'

// Acordeón: se abre una pregunta por vez. Al tocar la abierta, se cierra.
const PreguntasFrecuentes = ({ nombre }) => {
  const preguntas = [
    { pregunta: `¿Puedo visitar a ${nombre}?`, respuesta: 'Para evitar que se acostumbre a las personas, solo entra el personal médico. Los videos te mantienen conectado.' },
    { pregunta: `¿Qué pasa cuando ${nombre} vuelva al mar?`, respuesta: 'Seguís su liberación en directo y tu apadrinamiento pasa a otra cría o se pausa cuando quieras.' },
    { pregunta: '¿Cuánto dura el compromiso?', respuesta: 'No hay plazos: podés pausar o cancelar cuando quieras.' },
  ]

  // Guardamos cuál está abierta; null significa que no hay ninguna abierta
  const [abierta, setAbierta] = useState(null)

  const tocar = (pregunta) => {
    setAbierta(abierta === pregunta ? null : pregunta)
  }

  return (
    <div className="space-y-space-sm">
      <h2 className="font-headline-md text-headline-md text-on-surface">Preguntas frecuentes</h2>
      {preguntas.map((item) => (
        <div key={item.pregunta} className="bg-surface-container-lowest rounded-xl shadow-sm">
          <button onClick={() => tocar(item.pregunta)} className="w-full flex justify-between items-center p-space-md text-left">
            <span className="font-title-lg text-title-lg text-primary">{item.pregunta}</span>
            <Icono nombre={abierta === item.pregunta ? 'expand_less' : 'expand_more'} />
          </button>
          {abierta === item.pregunta && (
            <p className="px-space-md pb-space-md font-body-md text-body-md text-on-surface-variant">{item.respuesta}</p>
          )}
        </div>
      ))}
    </div>
  )
}

export default PreguntasFrecuentes
