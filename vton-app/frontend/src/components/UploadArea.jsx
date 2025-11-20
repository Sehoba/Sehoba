export default function UploadArea({ photo, garment, onPhotoChange, onGarmentChange }) {
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <FileInput
        label="Foto Person"
        description="Selfie oder Ganzkörperfoto"
        file={photo}
        accept="image/*"
        onChange={onPhotoChange}
      />
      <FileInput
        label="Kleidungsstück"
        description="PNG oder JPG"
        file={garment}
        accept="image/*"
        onChange={onGarmentChange}
      />
    </div>
  );
}

function FileInput({ label, description, file, onChange, accept }) {
  return (
    <label className="flex cursor-pointer flex-col rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-700 hover:border-indigo-400">
      <span className="text-base font-semibold text-slate-900">{label}</span>
      <span className="text-xs text-slate-500">{description}</span>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
      {file ? (
        <span className="mt-2 truncate text-xs text-indigo-700">{file.name}</span>
      ) : (
        <span className="mt-2 text-xs text-slate-500">Datei auswählen</span>
      )}
    </label>
  );
}
