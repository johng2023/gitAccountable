export default function ProgressBar({ current = 0, total = 7, animated = true }) {
  const percentage = (current / total) * 100;
  const animationClass = animated ? 'transition-all duration-500' : '';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="text-white font-semibold">{current}/{total} days complete</span>
        <span className="text-slate-300 text-sm">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
        <div
          className={`bg-green-500 h-full ${animationClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
