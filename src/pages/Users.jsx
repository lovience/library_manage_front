import { Plus, Search, ShieldCheck, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api, { getApiError } from "../api/client";
import EmptyState from "../components/EmptyState";
import StatusBadge from "../components/StatusBadge";

const emptyUser = {
  name: "",
  email: "",
  password: "",
  role: "member",
  phone: "",
  address: ""
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyUser);
  const [submitting, setSubmitting] = useState(false);

  const visibleUsers = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return users.filter((user) => {
      const roleMatches = role === "all" || user.role === role;
      const searchMatches =
        !needle ||
        [user.name, user.email, user.membershipId].filter(Boolean).some((value) => value.toLowerCase().includes(needle));
      return roleMatches && searchMatches;
    });
  }, [users, search, role]);

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/users");
      setUsers(data.users);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/users", form);
      setNotice("User created");
      setForm(emptyUser);
      setModalOpen(false);
      await loadUsers();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (user, nextRole) => {
    setError("");
    try {
      await api.patch(`/users/${user._id}`, { role: nextRole });
      setNotice("Role updated");
      await loadUsers();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const handleDeactivate = async (user) => {
    if (!window.confirm(`Deactivate ${user.name}?`)) return;

    setError("");
    try {
      await api.delete(`/users/${user._id}`);
      setNotice("User deactivated");
      await loadUsers();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <span className="eyebrow">Administration</span>
          <h1>Users</h1>
        </div>
        <button type="button" className="primary-button" onClick={() => setModalOpen(true)}>
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </section>

      <section className="toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users"
          />
        </label>
        <label className="filter-field">
          <ShieldCheck size={18} />
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="librarian">Librarian</option>
            <option value="member">Member</option>
          </select>
        </label>
      </section>

      {error && <div className="form-error">{error}</div>}
      {notice && <div className="form-success">{notice}</div>}

      {loading ? (
        <div className="table-shell loading-block" />
      ) : visibleUsers.length ? (
        <section className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Membership</th>
                <th>Status</th>
                <th>Joined</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="table-user">
                      <span>{user.name?.charAt(0)}</span>
                      <div>
                        <strong>{user.name}</strong>
                        <small>{user.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      className="inline-select"
                      value={user.role}
                      onChange={(event) => handleRoleChange(user, event.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="librarian">Librarian</option>
                      <option value="member">Member</option>
                    </select>
                  </td>
                  <td>{user.membershipId || "Staff"}</td>
                  <td>
                    <StatusBadge status={user.status} />
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user.status === "active" && (
                      <button type="button" className="secondary-button compact-button" onClick={() => handleDeactivate(user)}>
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <EmptyState icon={UserRound} title="No users found" message="User accounts matching this view will appear here." />
      )}

      {modalOpen && (
        <div className="modal-backdrop">
          <section className="modal-panel compact" role="dialog" aria-modal="true" aria-label="Create user">
            <div className="modal-header">
              <div>
                <span className="eyebrow">User</span>
                <h2>Create Account</h2>
              </div>
              <button type="button" className="icon-button" aria-label="Close" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form className="form-grid one-column" onSubmit={handleSubmit}>
              <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  minLength="8"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Role
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="member">Member</option>
                  <option value="librarian">Librarian</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label>
                Phone
                <input name="phone" value={form.phone} onChange={handleChange} />
              </label>
              <label>
                Address
                <input name="address" value={form.address} onChange={handleChange} />
              </label>

              <div className="modal-actions">
                <button type="button" className="secondary-button" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={submitting}>
                  <Plus size={17} />
                  <span>{submitting ? "Creating" : "Create"}</span>
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default Users;
