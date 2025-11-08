export default function Badge({ status, children }) {
  const statusClasses = {
    active: 'bg-green-600 text-white',
    completed: 'bg-green-600 text-white',
    failed: 'bg-red-600 text-white',
    pending: 'bg-amber-500 text-slate-900',
  };

  return (
    <span className={`px-3 py-1 rounded text-sm font-semibold ${statusClasses[status]}`}>
      {children}
    </span>
  );
}
