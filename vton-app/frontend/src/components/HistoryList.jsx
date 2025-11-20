export default function HistoryList({ history }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
      <h3 className="text-base font-semibold text-slate-900">History</h3>
      <p className="text-xs text-slate-500">Letzte Ergebnisse aus Firestore</p>
      <div className="mt-4 space-y-3">
        {history.length === 0 && (
          <p className="text-sm text-slate-600">Noch keine Einträge.</p>
        )}
        {history.map((item) => (
          <article
            key={item.id}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
          >
            <img
              src={item.resultUrl}
              alt={item.category}
              className="h-20 w-16 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">{item.category}</p>
              <p className="text-xs text-slate-600">{item.style}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
