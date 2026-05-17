import { CalendarCheck, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const CheckoutModal = ({ book, members, onClose, onSubmit, submitting }) => {
  const { isStaff } = useAuth();
  const [form, setForm] = useState({
    userId: members[0]?._id || "",
    dueDays: 14,
    notes: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      bookId: book._id,
      userId: isStaff ? form.userId : undefined,
      dueDays: Number(form.dueDays),
      notes: form.notes
    });
  };

  return (
    <div className="modal-backdrop">
      <section className="modal-panel compact" role="dialog" aria-modal="true" aria-label="Checkout book">
        <div className="modal-header">
          <div>
            <span className="eyebrow">Checkout</span>
            <h2>{book.title}</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="form-grid one-column" onSubmit={handleSubmit}>
          {isStaff && (
            <label>
              Borrower
              <select name="userId" value={form.userId} onChange={handleChange} required>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} · {member.email}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label>
            Loan Period
            <input
              name="dueDays"
              type="number"
              min="1"
              max="90"
              value={form.dueDays}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Notes
            <textarea name="notes" rows="3" value={form.notes} onChange={handleChange} />
          </label>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={submitting || (isStaff && !form.userId)}>
              <CalendarCheck size={17} />
              <span>{submitting ? "Checking Out" : "Confirm"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CheckoutModal;
