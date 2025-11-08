export default function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = null,
  success = false,
  disabled = false,
  className = '',
}) {
  const baseClasses = 'w-full px-4 py-3 rounded border transition-colors duration-200';

  let borderColor = 'border-slate-700 focus:border-blue-500';
  if (error) {
    borderColor = 'border-red-500 focus:border-red-600';
  } else if (success) {
    borderColor = 'border-green-500 focus:border-green-600';
  }

  const finalClass = `${baseClasses} ${borderColor} bg-slate-800 text-white placeholder-slate-500 ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } ${className}`;

  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={finalClass}
      />
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-2">Valid</p>}
    </div>
  );
}
