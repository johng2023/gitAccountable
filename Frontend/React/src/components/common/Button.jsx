export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}) {
  const baseClasses = 'font-semibold rounded transition-all duration-200 cursor-pointer';

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50',
    secondary: 'bg-slate-800 text-blue-400 border border-blue-500 hover:bg-slate-700',
    ghost: 'text-blue-400 hover:underline',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  const finalClass = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={finalClass}
    >
      {children}
    </button>
  );
}
