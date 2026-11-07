import Icono from './Icono'

// La "marca" de un patrocinador: su símbolo en un círculo y su nombre. No usamos imágenes de logos:
// cada empresa elige un símbolo (Material Symbols) y así todas se ven parejas en el sitio.
// tamanio: 'grande' (nivel Océano), 'mediano' (Arrecife) o 'chico' (Coral y sellos).
const tamanios = {
  grande: { circulo: 'w-14 h-14', icono: 'text-[30px]', texto: 'font-headline-sm text-headline-sm' },
  mediano: { circulo: 'w-11 h-11', icono: 'text-[24px]', texto: 'font-title-lg text-title-lg' },
  chico: { circulo: 'w-8 h-8', icono: 'text-[18px]', texto: 'font-label-lg text-label-lg' },
}

const LogoPatrocinador = ({ nombre, icono, tamanio = 'mediano' }) => {
  const medidas = tamanios[tamanio]
  return (
    <span className="inline-flex items-center gap-space-sm">
      <span className={`${medidas.circulo} shrink-0 rounded-full fondo-mar text-on-primary flex items-center justify-center shadow-sm`}>
        <Icono nombre={icono} clase={medidas.icono} />
      </span>
      <span className={`${medidas.texto} text-primary`}>{nombre}</span>
    </span>
  )
}

export default LogoPatrocinador
