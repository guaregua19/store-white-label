export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-2 py-24 text-center">
      <h1 className="text-2xl font-semibold">No encontramos lo que buscas</h1>
      <p className="text-muted">La tienda o el producto no existe, o no está disponible en este momento.</p>
    </div>
  );
}
