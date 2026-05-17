import { BookPlus, BookOpen, Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api, { getApiError } from "../api/client";
import BookCard from "../components/BookCard";
import BookFormModal from "../components/BookFormModal";
import CheckoutModal from "../components/CheckoutModal";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";

const Books = () => {
  const { isStaff } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [bookForm, setBookForm] = useState({ open: false, book: null });
  const [checkoutBook, setCheckoutBook] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    return params.toString();
  }, [search, category]);

  const loadBooks = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/books${query ? `?${query}` : ""}`);
      setBooks(data.books);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await api.get("/books/categories");
      setCategories(data.categories);
    } catch (err) {
      setCategories([]);
    }
  };

  const loadMembers = async () => {
    if (!isStaff || members.length) return;
    const { data } = await api.get("/users?role=member&status=active");
    setMembers(data.users);
  };

  useEffect(() => {
    loadBooks();
  }, [query]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSaveBook = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      if (bookForm.book) {
        await api.patch(`/books/${bookForm.book._id}`, payload);
        setNotice("Book updated");
      } else {
        await api.post("/books", payload);
        setNotice("Book added");
      }
      setBookForm({ open: false, book: null });
      await Promise.all([loadBooks(), loadCategories()]);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async (book) => {
    if (!window.confirm(`Remove "${book.title}" from the catalog?`)) return;

    setError("");
    try {
      await api.delete(`/books/${book._id}`);
      setNotice("Book removed");
      await loadBooks();
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const handleOpenCheckout = async (book) => {
    setError("");
    try {
      if (isStaff) {
        await loadMembers();
      }
      setCheckoutBook(book);
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const handleCheckout = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      await api.post("/borrows", payload);
      setNotice("Checkout recorded");
      setCheckoutBook(null);
      await loadBooks();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <section className="page-heading">
        <div>
          <span className="eyebrow">Catalog</span>
          <h1>Books</h1>
        </div>
        {isStaff && (
          <button type="button" className="primary-button" onClick={() => setBookForm({ open: true, book: null })}>
            <BookPlus size={18} />
            <span>Add Book</span>
          </button>
        )}
      </section>

      <section className="toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title, author, ISBN"
          />
        </label>
        <label className="filter-field">
          <Filter size={18} />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </section>

      {error && <div className="form-error">{error}</div>}
      {notice && <div className="form-success">{notice}</div>}

      {loading ? (
        <div className="skeleton-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="book-skeleton" key={index} />
          ))}
        </div>
      ) : books.length ? (
        <section className="book-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={book}
              canManage={isStaff}
              onCheckout={handleOpenCheckout}
              onEdit={(selectedBook) => setBookForm({ open: true, book: selectedBook })}
              onDelete={handleDeleteBook}
            />
          ))}
        </section>
      ) : (
        <EmptyState icon={BookOpen} title="No books found" message="Try another search or add a new catalog item." />
      )}

      {bookForm.open && (
        <BookFormModal
          book={bookForm.book}
          onClose={() => setBookForm({ open: false, book: null })}
          onSubmit={handleSaveBook}
          submitting={submitting}
        />
      )}

      {checkoutBook && (
        <CheckoutModal
          book={checkoutBook}
          members={members}
          onClose={() => setCheckoutBook(null)}
          onSubmit={handleCheckout}
          submitting={submitting}
        />
      )}
    </div>
  );
};

export default Books;

