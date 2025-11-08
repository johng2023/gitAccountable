export default function Badge({ status, children }) {
  const badgeClass = {
    active: 'badge badge-active',
    completed: 'badge badge-completed',
    failed: 'badge badge-failed',
    pending: 'badge badge-pending',
  }[status];

  return (
    <span className={badgeClass}>
      {children}
    </span>
  );
}
