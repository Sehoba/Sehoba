export default function Preview({ url }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
        <span className="text-xs uppercase tracking-wide text-slate-500">Live</span>
      </div>
      {url ? (
        <img
          src={url}
          alt="Generated try-on"
          className="mt-4 w-full rounded-xl border border-slate-200 object-cover shadow"
        />
      ) : (
        <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          Ergebnis erscheint hier, sobald die Stable-Diffusion Pipeline fertig ist.
        </p>
      )}
    </div>
  );
}
