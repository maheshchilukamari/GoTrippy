export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="grid min-h-[50vh] place-items-center bg-slate-50 px-4">
      <div className="text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-saffron-500" />
        <p className="text-sm font-semibold text-slate-600">{label}...</p>
      </div>
    </div>
  );
}
