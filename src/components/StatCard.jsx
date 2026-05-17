const StatCard = ({ icon: Icon, label, value, tone = "blue", detail }) => {
  return (
    <article className={`stat-card tone-${tone}`}>
      <div className="stat-icon">{Icon && <Icon size={22} />}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </article>
  );
};

export default StatCard;

