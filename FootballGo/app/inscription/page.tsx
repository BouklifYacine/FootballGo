import ClientInscriptionFormulaire from "./ClientInscriptionFormulaire";

export default function InscriptionPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Inscription</h2>
        <ClientInscriptionFormulaire />
      </div>
    </div>
  );
}