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
  const inputClass = error ? 'input error' : success ? 'input success' : 'input';

  return (
    <div className="input-wrapper">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${inputClass} ${className}`}
      />
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">Valid</p>}
    </div>
  );
}
