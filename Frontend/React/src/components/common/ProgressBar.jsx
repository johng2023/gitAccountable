export default function ProgressBar({ current = 0, total = 7, animated = true }) {
  const percentage = (current / total) * 100;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontWeight: '600' }}>{current}/{total} days complete</span>
        <span style={{ fontSize: '14px', color: '#cbd5e1' }}>{Math.round(percentage)}%</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
