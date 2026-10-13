// El muelle cuando todavía no se conoce el del usuario. items: [{ animal, plan, cantidad }]
export const SIN_MUELLE = { id: null, items: [] }

// El muelle con ese ítem puesto: si el animal ya estaba, lo reemplaza; si no, lo agrega
export const conItem = (muelle, item) => {
  const yaEstaba = muelle.items.some((otro) => otro.animal.id === item.animal.id)
  const items = yaEstaba ? muelle.items.map((otro) => (otro.animal.id === item.animal.id ? item : otro)) : [...muelle.items, item]
  return { ...muelle, items }
}
