import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  LibraryBig,
  LogOut,
  Menu,
  Search,
  Users,
  X
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
  { label: "Catalog", to: "/books", icon: BookOpen },
  { label: "Loans", to: "/loans", icon: ClipboardList },
  { label: "Users", to: "/users", icon: Users, adminOnly: true }
];

const roleLabel = {
  admin: "Administrator",
  librarian: "Librarian",
  member: "Member"
};

const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const visibleNav = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="brand">
          <span className="brand-mark">
            <LibraryBig size={25} />
          </span>
          <div>
            <strong>LibraFlow</strong>
            <span>Library Management</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => (isActive ? "nav-link is-active" : "nav-link")}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button type="button" className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="workspace">
        <header className="topbar">
          <button
            type="button"
            className="icon-button mobile-menu"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="global-search">
            <Search size={18} />
            <span>Search catalog, loans, or members</span>
          </div>

          <div className="user-chip">
            <span className="avatar">{user?.name?.charAt(0) || "U"}</span>
            <div>
              <strong>{user?.name}</strong>
              <span>{roleLabel[user?.role] || "User"}</span>
            </div>
          </div>

          <button
            type="button"
            className="icon-button close-mobile"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </header>

        <main className="page-frame">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;

