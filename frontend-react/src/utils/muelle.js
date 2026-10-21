export const SIN_MUELLE = { id: null, items: [] }

export const conItem = (muelle, item) => {
  const yaEstaba = muelle.items.some((otro) => otro.animal.id === item.animal.id)
  const items = yaEstaba ? muelle.items.map((otro) => (otro.animal.id === item.animal.id ? item : otro)) : [...muelle.items, item]
  return { ...muelle, items }
}
