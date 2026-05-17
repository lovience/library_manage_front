import { BookOpenCheck, KeyRound, LibraryBig, Mail, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { getApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";

const roles = [
  {
    value: "member",
    label: "Member",
    icon: UserRound,
    description: "Borrow books and track returns"
  },
  {
    value: "librarian",
    label: "Librarian",
    icon: BookOpenCheck,
    description: "Manage catalog and circulation"
  },
  {
    value: "admin",
    label: "Admin",
    icon: ShieldCheck,
    description: "Control users and system access"
  }
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("member");
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const from = location.state?.from?.pathname || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (mode === "register") {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password, role: selectedRole });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-visual" aria-label="Library preview">
        <div className="brand large">
          <span className="brand-mark">
            <LibraryBig size={28} />
          </span>
          <div>
            <strong>LibraFlow</strong>
            <span>Library Management</span>
          </div>
        </div>

        <div className="shelf-scene">
          <div className="book-spine teal" />
          <div className="book-spine coral tall" />
          <div className="book-spine gold" />
          <div className="book-spine blue tall" />
          <div className="book-spine ink" />
        </div>

        <div className="library-card-preview">
          <span>Active Loans</span>
          <strong>248</strong>
          <div className="mini-bars">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-header">
          <span className="eyebrow">{mode === "login" ? "Welcome back" : "New member"}</span>
          <h1>{mode === "login" ? "Sign in to your library workspace" : "Create member account"}</h1>
        </div>

        {mode === "login" && (
          <div className="role-selector" role="tablist" aria-label="Portal type">
            {roles.map((role) => {
              const Icon = role.icon;
              const active = selectedRole === role.value;
              return (
                <button
                  type="button"
                  key={role.value}
                  className={active ? "role-option is-active" : "role-option"}
                  onClick={() => setSelectedRole(role.value)}
                >
                  <Icon size={20} />
                  <strong>{role.label}</strong>
                  <span>{role.description}</span>
                </button>
              );
            })}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Name
              <span>
                <UserRound size={18} />
                <input name="name" value={form.name} onChange={handleChange} required />
              </span>
            </label>
          )}

          <label>
            Email
            <span>
              <Mail size={18} />
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </span>
          </label>

          <label>
            Password
            <span>
              <KeyRound size={18} />
              <input
                name="password"
                type="password"
                minLength="8"
                value={form.password}
                onChange={handleChange}
                required
              />
            </span>
          </label>

          {mode === "register" && (
            <>
              <label>
                Phone
                <span>
                  <UserRound size={18} />
                  <input name="phone" value={form.phone} onChange={handleChange} />
                </span>
              </label>
              <label>
                Address
                <span>
                  <LibraryBig size={18} />
                  <input name="address" value={form.address} onChange={handleChange} />
                </span>
              </label>
            </>
          )}

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="primary-button full" disabled={submitting}>
            <span>{submitting ? "Please wait" : mode === "login" ? "Sign In" : "Create Account"}</span>
          </button>
        </form>

        <p className="switch-auth">
          {mode === "login" ? "Need a member account?" : "Already have an account?"}{" "}
          <Link
            to="/login"
            onClick={(event) => {
              event.preventDefault();
              setError("");
              setMode(mode === "login" ? "register" : "login");
            }}
          >
            {mode === "login" ? "Register" : "Sign in"}
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;

