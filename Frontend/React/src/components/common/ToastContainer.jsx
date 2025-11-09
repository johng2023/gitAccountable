import { useToast } from '../../context/ToastContext';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            padding: '16px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            animation: 'slideIn 0.3s ease',
            pointerEvents: 'auto',
            backgroundColor:
              toast.type === 'error'
                ? '#ef4444'
                : toast.type === 'success'
                ? '#10b981'
                : toast.type === 'warning'
                ? '#f59e0b'
                : '#3b82f6',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
