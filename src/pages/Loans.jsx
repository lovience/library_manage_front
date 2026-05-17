import { BookOpen, CalendarDays, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api, { getApiError } from "../api/client";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";

const filters = [
  { label: "Active", value: "active" },
  { label: "Borrowed", value: "borrowed" },
  { label: "Overdue", value: "overdue" },
  { label: "Returned", value: "returned" },
  { label: "All", value: "all" }
];

const Loans = () => {
  const { isStaff } = useAuth();
  const [loans, setLoans] = useState([]);
  const [status, setStatus] = useState("active");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const visibleLoans = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return loans;

    return loans.filter((loan) => {
      return [loan.book?.title, loan.book?.author, loan.user?.name, loan.user?.email]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(needle));
    });
  }, [loans, search]);

  const loadLoans = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/borrows?status=${status}`);
      setLoans(data.borrows);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, [status]);

  const handleReturn = async (loan) => {
    setError("");
    try {
      await api.patch(`/borrows/${loan._id}/return`);
      setNotice("Return recorded");
      await loadLoans();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <span className="eyebrow">Circulation</span>
          <h1>{isStaff ? "Loans" : "My Loans"}</h1>
        </div>
      </section>

      <section className="toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search loans"
          />
        </label>
        <div className="segmented-control">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter.value}
              className={status === filter.value ? "is-active" : ""}
              onClick={() => setStatus(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {error && <div className="form-error">{error}</div>}
      {notice && <div className="form-success">{notice}</div>}

      {loading ? (
        <div className="table-shell loading-block" />
      ) : visibleLoans.length ? (
        <section className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Book</th>
                {isStaff && <th>Borrower</th>}
                <th>Borrowed</th>
                <th>Due</th>
                <th>Status</th>
                <th>Fine</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibleLoans.map((loan) => (
                <tr key={loan._id}>
                  <td>
                    <div className="table-book">
                      <span style={{ background: loan.book?.coverColor || "#2563eb" }}>
                        <BookOpen size={16} />
                      </span>
                      <div>
                        <strong>{loan.book?.title}</strong>
                        <small>{loan.book?.author}</small>
                      </div>
                    </div>
                  </td>
                  {isStaff && (
                    <td>
                      <strong>{loan.user?.name}</strong>
                      <small>{loan.user?.email}</small>
                    </td>
                  )}
                  <td>{new Date(loan.borrowedAt).toLocaleDateString()}</td>
                  <td>
                    <span className="date-cell">
                      <CalendarDays size={15} />
                      {new Date(loan.dueAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={loan.status} />
                  </td>
                  <td>${loan.fineAmount || 0}</td>
                  <td>
                    {loan.status !== "returned" && (
                      <button type="button" className="secondary-button compact-button" onClick={() => handleReturn(loan)}>
                        <RotateCcw size={16} />
                        <span>Return</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <EmptyState icon={BookOpen} title="No loans found" message="Circulation records matching this view will appear here." />
      )}
    </div>
  );
};

export default Loans;
