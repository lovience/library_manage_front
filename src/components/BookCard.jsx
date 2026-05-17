import { BookOpen, Edit3, MapPin, Trash2 } from "lucide-react";

const BookCard = ({ book, canManage, onCheckout, onEdit, onDelete }) => {
  const isAvailable = book.availableCopies > 0 && book.status === "active";

  return (
    <article className="book-card">
      <div className="book-cover" style={{ background: book.coverColor || "#2563eb" }}>
        <BookOpen size={34} />
        <span>{book.category}</span>
      </div>

      <div className="book-body">
        <div>
          <div className="book-meta">
            <span>{book.isbn}</span>
            <span>{book.publishedYear || "N/A"}</span>
          </div>
          <h3>{book.title}</h3>
          <p>{book.author}</p>
        </div>

        <div className="copy-row">
          <div>
            <strong>{book.availableCopies}</strong>
            <span>Available</span>
          </div>
          <div>
            <strong>{book.totalCopies}</strong>
            <span>Total</span>
          </div>
          <div>
            <strong>{book.borrowedCopies || book.totalCopies - book.availableCopies}</strong>
            <span>On loan</span>
          </div>
        </div>

        <div className="book-location">
          <MapPin size={16} />
          <span>{book.shelfLocation || "Unassigned shelf"}</span>
        </div>

        <div className="book-actions">
          <button
            type="button"
            className="primary-button"
            disabled={!isAvailable}
            onClick={() => onCheckout(book)}
          >
            <BookOpen size={17} />
            <span>{isAvailable ? "Checkout" : "Unavailable"}</span>
          </button>

          {canManage && (
            <>
              <button type="button" className="icon-button" aria-label="Edit book" onClick={() => onEdit(book)}>
                <Edit3 size={17} />
              </button>
              <button
                type="button"
                className="icon-button danger"
                aria-label="Delete book"
                onClick={() => onDelete(book)}
              >
                <Trash2 size={17} />
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
};

export default BookCard;

