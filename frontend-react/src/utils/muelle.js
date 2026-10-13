// El muelle cuando todavía no se conoce el del usuario. items: [{ animal, plan, cantidad }]
export const SIN_MUELLE = { id: null, items: [] }

// El muelle con ese ítem puesto: si el animal ya estaba, lo reemplaza; si no, lo agrega
export const conItem = (muelle, item) => {
  const yaEstaba = muelle.items.some((otro) => otro.animal.id === item.animal.id)
  const items = yaEstaba ? muelle.items.map((otro) => (otro.animal.id === item.animal.id ? item : otro)) : [...muelle.items, item]
  return { ...muelle, items }
}

// El animal después de que le tomaron "cantidad" cupos (el progreso es el porcentaje de cupos tomados)
export const conCuposTomados = (animal, cantidad) => {
  const cuposDisponibles = animal.cuposDisponibles - cantidad
  const progreso = Math.round(((animal.cuposTotales - cuposDisponibles) * 100) / animal.cuposTotales)
  return { ...animal, cuposDisponibles, progreso }
}
