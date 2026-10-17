import Algas from '../marino/Algas'
import Concha from '../marino/Concha'
import Estrella from '../marino/Estrella'
import Pez from '../marino/Pez'

// Fondo del mar del footer: peces que cruzan, algas en los costados, una estrella y una concha.
// Es solo decoración: va detrás del contenido.
const FondoMarino = () => {
  return (
    <>
      <div className="nadar top-6">
        <Pez clase="w-12" />
      </div>
      <div className="nadar top-24" style={{ animationDelay: '-17s', animationDuration: '52s' }}>
        <Pez clase="w-8" color="#ffb59e" />
      </div>
      <Algas clase="w-16 lg:w-24 absolute left-2 bottom-0 opacity-70" />
      <Algas clase="w-14 lg:w-20 absolute right-6 bottom-0 opacity-70" />
      <Estrella clase="w-10 absolute left-24 lg:left-32 bottom-3 opacity-90" />
      <Concha clase="w-9 absolute right-28 lg:right-36 bottom-3 opacity-90" />
    </>
  )
}

export default FondoMarino