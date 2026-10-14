/** The classroom's soft, slowly moving mesh background (fixed behind every page). */
export const MeshBackground = () => (
  <div aria-hidden className="mesh" data-testid="mesh">
    <div className="mesh-blob -top-[20vmax] -left-[15vmax] bg-mesh-mint" />
    <div className="mesh-blob -top-[10vmax] -right-[20vmax] bg-mesh-sky [animation-delay:-12s]" />
    <div className="mesh-blob -bottom-[25vmax] left-[10vmax] bg-mesh-sage [animation-delay:-24s]" />
    <div className="mesh-blob -right-[10vmax] -bottom-[15vmax] bg-mesh-lime [animation-delay:-36s]" />
  </div>
)
