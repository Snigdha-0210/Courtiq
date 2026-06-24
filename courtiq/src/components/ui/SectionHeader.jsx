export function SectionHeader({ title, action, onAction }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <span className="section-title">{title}</span>
      {action && (
        <button onClick={onAction} className="text-[11px] text-gray-500 hover:text-white underline underline-offset-2 transition-colors">
          {action}
        </button>
      )}
    </div>
  );
}
