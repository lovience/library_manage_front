import { Save, X } from "lucide-react";
import { useEffect, useState } from "react";

const emptyBook = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  publisher: "",
  publishedYear: "",
  description: "",
  coverColor: "#2563eb",
  totalCopies: 1,
  shelfLocation: "",
  tags: ""
};

const BookFormModal = ({ book, onClose, onSubmit, submitting }) => {
  const [form, setForm] = useState(emptyBook);

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || "",
        author: book.author || "",
        isbn: book.isbn || "",
        category: book.category || "",
        publisher: book.publisher || "",
        publishedYear: book.publishedYear || "",
        description: book.description || "",
        coverColor: book.coverColor || "#2563eb",
        totalCopies: book.totalCopies || 1,
        shelfLocation: book.shelfLocation || "",
        tags: (book.tags || []).join(", ")
      });
    } else {
      setForm(emptyBook);
    }
  }, [book]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      publishedYear: form.publishedYear ? Number(form.publishedYear) : undefined,
      totalCopies: Number(form.totalCopies),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    });
  };

  return (
    <div className="modal-backdrop">
      <section className="modal-panel" role="dialog" aria-modal="true" aria-label="Book form">
        <div className="modal-header">
          <div>
            <span className="eyebrow">Catalog</span>
            <h2>{book ? "Edit Book" : "Add Book"}</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Author
            <input name="author" value={form.author} onChange={handleChange} required />
          </label>
          <label>
            ISBN
            <input name="isbn" value={form.isbn} onChange={handleChange} required />
          </label>
          <label>
            Category
            <input name="category" value={form.category} onChange={handleChange} required />
          </label>
          <label>
            Publisher
            <input name="publisher" value={form.publisher} onChange={handleChange} />
          </label>
          <label>
            Published Year
            <input
              name="publishedYear"
              type="number"
              min="1000"
              max="2100"
              value={form.publishedYear}
              onChange={handleChange}
            />
          </label>
          <label>
            Total Copies
            <input
              name="totalCopies"
              type="number"
              min="0"
              value={form.totalCopies}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Shelf
            <input name="shelfLocation" value={form.shelfLocation} onChange={handleChange} />
          </label>
          <label>
            Cover Color
            <input name="coverColor" type="color" value={form.coverColor} onChange={handleChange} />
          </label>
          <label className="span-2">
            Tags
            <input name="tags" value={form.tags} onChange={handleChange} />
          </label>
          <label className="span-2">
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
          </label>

          <div className="modal-actions span-2">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={submitting}>
              <Save size={17} />
              <span>{submitting ? "Saving" : "Save Book"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default BookFormModal;

