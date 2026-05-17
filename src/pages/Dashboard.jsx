import {
  AlertTriangle,
  BookMarked,
  BookOpen,
  ClipboardCheck,
  LibraryBig,
  RotateCcw,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import api, { getApiError } from "../api/client";
import EmptyState from "../components/EmptyState";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard/stats");
        setDashboard(data);
      } catch (err) {
        setError(getApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = dashboard?.stats || {};

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Good day, {user?.name?.split(" ")[0]}</h1>
        </div>
        <div className="heading-metric">
          <LibraryBig size={19} />
          <span>{user?.role}</span>
        </div>
      </section>

      {error && <div className="form-error">{error}</div>}

      <section className="stats-grid">
        <StatCard icon={BookOpen} label="Titles" value={loading ? "..." : stats.totalBooks || 0} tone="blue" />
        <StatCard
          icon={BookMarked}
          label="Available Copies"
          value={loading ? "..." : stats.availableCopies || 0}
          tone="green"
          detail={`${stats.totalCopies || 0} total copies`}
        />
        <StatCard
          icon={ClipboardCheck}
          label="Active Loans"
          value={loading ? "..." : stats.activeLoans || 0}
          tone="orange"
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue"
          value={loading ? "..." : stats.overdueLoans || 0}
          tone="red"
        />
        <StatCard icon={Users} label="Members" value={loading ? "..." : stats.memberCount || 0} tone="violet" />
        <StatCard
          icon={RotateCcw}
          label="Returned This Month"
          value={loading ? "..." : stats.returnedThisMonth || 0}
          tone="ink"
        />
      </section>

      <section className="activity-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">Circulation</span>
            <h2>Recent Loans</h2>
          </div>
        </div>

        {!loading && dashboard?.recentBorrows?.length === 0 && (
          <EmptyState icon={ClipboardCheck} title="No loans yet" message="New circulation activity will appear here." />
        )}

        <div className="activity-list">
          {dashboard?.recentBorrows?.map((borrow) => (
            <article key={borrow._id} className="activity-row">
              <span className="activity-book" style={{ background: borrow.book?.coverColor || "#2563eb" }}>
                <BookOpen size={18} />
              </span>
              <div>
                <strong>{borrow.book?.title}</strong>
                <span>{borrow.user?.name || "Member"} · Due {new Date(borrow.dueAt).toLocaleDateString()}</span>
              </div>
              <StatusBadge status={borrow.status} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
