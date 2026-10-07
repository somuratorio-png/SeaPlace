import Concha from '../marino/Concha'

// Título de una sección: una conchita, el texto y una olita de subrayado
const TituloSeccion = ({ children, centrado = false }) => {
  return (
    <div className={`space-y-1 ${centrado ? 'text-center' : ''}`}>
      <h2 className={`flex items-center gap-space-sm font-headline-md text-headline-md text-primary ${centrado ? 'justify-center' : ''}`}>
        <Concha clase="w-8 shrink-0" />
        {children}
      </h2>
      <svg viewBox="0 0 120 10" aria-hidden="true" className={`w-28 h-2.5 text-tertiary ${centrado ? 'mx-auto' : ''}`}>
        <path d="M2 5 Q 12 -2 22 5 T 42 5 T 62 5 T 82 5 T 102 5 T 118 5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default TituloSeccion
