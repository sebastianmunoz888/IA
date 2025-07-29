export default function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-blue-700">
        ¡Bienvenido a Legal IA!
      </h1>
      <p className="mt-4 text-gray-600">
        Tu asistente legal inteligente impulsado por IA.
      </p>

      <a href="/chat" className="mt-8 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Ir al Chat Legal IA
      </a>
    </div>
  );
}
