export const runtime = "edge";

export default async function HomePage() {
  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-br from-green-100 via-emerald-100 to-lime-100">
      <div className="container mt-12 flex h-full flex-col gap-4 py-8">
        <div className="text-[50px] text-slate-600">Vettee</div>
        <div className="text-[140px] leading-[0.9] text-slate-700">
          The ultimate companion for your companion.
        </div>
      </div>
    </main>
  );
}
