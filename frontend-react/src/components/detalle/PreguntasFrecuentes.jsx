import { useState } from 'react'
import PreguntaFrecuente from './PreguntaFrecuente'

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
          <PreguntaFrecuente
            key={item.pregunta}
            pregunta={item.pregunta}
            respuesta={item.respuesta}
            abierta={abierta === item.pregunta}
            onTocar={() => tocar(item.pregunta)}
          />
        ))}
    </div>
  )
}

export default PreguntasFrecuentes
