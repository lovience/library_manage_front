const EmptyState = ({ icon: Icon, title, message }) => {
  return (
    <div className="empty-state">
      {Icon && (
        <div className="empty-icon">
          <Icon size={28} />
        </div>
      )}
      <strong>{title}</strong>
      <span>{message}</span>
    </div>
  );
};

export default EmptyState;
