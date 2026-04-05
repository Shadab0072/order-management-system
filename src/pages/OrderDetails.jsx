import { useParams, Link, useNavigate } from "react-router-dom";
import { useOrders } from "@/context/OrderContext";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Circle,
  MapPin,
  Mail,
  Pencil,
  Phone,
  Plus,
  Trash2,
  UserCog,
  X
} from "lucide-react";
import { cn } from "@/lib/cn";
import React, { useState } from "react";
const statusBg = {
  pending: "bg-warning/10 text-warning",
  in_progress: "bg-info/10 text-info",
  completed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive"
};
function OrderDetails() {
  const { id } = useParams();
  const { orders, updateTimelineStep, updateOrder } = useOrders();
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const order = orders.find((o) => o.id === id);
  if (!order) return (
    <div
      className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <p>
        Order not found
      </p>
      <Link to="/orders" className="mt-4 text-primary hover:underline">
        Back to orders
      </Link>
    </div>
  );
  const notes = Array.isArray(order.notes) ? order.notes : [];
  const addNote = () => {
    if (!newNote.trim()) return;
    updateOrder(order.id, { notes: [...notes, newNote.trim()] });
    setNewNote("");
  };
  const deleteNote = (index) => {
    const next = notes.filter((_, idx) => idx !== index);
    updateOrder(order.id, { notes: next });
    if (editingIndex === index) {
      setEditingIndex(null);
      setEditDraft("");
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }
  };
  const startEditNote = (index) => {
    setEditingIndex(index);
    setEditDraft(notes[index] ?? "");
  };
  const saveEditedNote = () => {
    if (editingIndex === null) return;
    const trimmed = editDraft.trim();
    if (!trimmed) return;
    const next = notes.map((n, idx) => (idx === editingIndex ? trimmed : n));
    updateOrder(order.id, { notes: next });
    setEditingIndex(null);
    setEditDraft("");
  };
  const cancelEditNote = () => {
    setEditingIndex(null);
    setEditDraft("");
  };
  const agent = order.agent;
  const agentInitials = agent
    ? (agent.initials ||
        agent.name
          .split(/\s+/)
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase())
    : "";
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-foreground truncate">
            {order.id}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {new Date(order.date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
          </p>
        </div>
        <span
          className={cn("px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium capitalize shrink-0", statusBg[order.status])}>
          {order.status.replace("_", " ")}
        </span>
      </div>
      <div className="glass-card p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 sm:mb-6">
          Order Timeline
        </h3>
        <div className="hidden sm:flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-surface-2" />
          {order.timeline.map((step) => <div key={step.id} className="relative flex flex-col items-center z-10">
            <button
              onClick={() => updateTimelineStep(order.id, step.id, !step.completed)}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200",
                step.completed ? "gradient-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground hover:bg-surface-3"
              )}>
              {step.completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            </button>
            <span
              className={cn("mt-2 text-xs font-medium", step.completed ? "text-foreground" : "text-muted-foreground")}>
              {step.label}
            </span>
            {step.date && <span className="text-[10px] text-muted-foreground mt-0.5">
              {new Date(step.date).toLocaleDateString()}
            </span>}
          </div>)}
        </div>
        <div className="sm:hidden space-y-4">
          {order.timeline.map((step, i) => <div key={step.id} className="flex items-start gap-3 relative">
            {i < order.timeline.length - 1 && <div
              className="absolute left-4 top-8 w-0.5 h-[calc(100%+0.5rem)] bg-surface-2" />}
            <button
              onClick={() => updateTimelineStep(order.id, step.id, !step.completed)}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 z-10",
                step.completed ? "gradient-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground hover:bg-surface-3"
              )}>
              {step.completed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            </button>
            <div className="pt-1">
              <span
                className={cn("text-sm font-medium", step.completed ? "text-foreground" : "text-muted-foreground")}>
                {step.label}
              </span>
              {step.date && <p className="text-[11px] text-muted-foreground">
                {new Date(step.date).toLocaleDateString()}
              </p>}
            </div>
          </div>)}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="space-y-4 sm:space-y-6">
          <div className="glass-card p-4 sm:p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Customer Info
            </h3>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-full bg-surface-2 flex items-center justify-center text-sm font-semibold text-foreground shrink-0">
                {order.customer.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {order.customer.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Customer
                </p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                <Mail className="h-4 w-4 shrink-0" />
                {" "}
                <span className="truncate">
                  {order.customer.email}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                {" "}
                {order.customer.phone}
              </div>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                {" "}
                <span className="break-words">
                  {order.customer.address}
                  {", "}
                  {order.customer.city}
                  {", "}
                  {order.customer.state}
                  {" "}
                  {order.customer.zip}
                </span>
              </div>
            </div>
          </div>
          <div className="glass-card relative overflow-hidden p-4 sm:p-6">
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/10 blur-2xl" />
            <div className="relative">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground sm:gap-2.5">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/15 text-primary">
                  <UserCog className="h-4 w-4" />
                </span>
                Assigned Agent
              </h3>
              {agent ? <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-primary-foreground gradient-primary shadow-md shadow-primary/15 sm:h-12 sm:w-12">
                    {agentInitials}
                  </div>
                  <div className="min-w-0 space-y-1.5 pt-0.5">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {agent.name}
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {agent.role}
                    </p>
                  </div>
                </div>
                {agent.id && <p className="border-t border-border pt-4 text-[11px] font-mono leading-relaxed text-muted-foreground sm:pt-5">
                  ID:
                  {" "}
                  {agent.id}
                </p>}
              </div> : <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:mt-5">
                No agent assigned. Edit the order to assign one.
              </p>}
            </div>
          </div>
        </div>
        <div className="glass-card p-4 sm:p-6 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Order Items
          </h3>
          <div className="sm:hidden space-y-3">
            {order.items.map((item) => <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity}
                  {" \xD7 ₹"}
                  {item.price.toFixed(2)}
                </p>
              </div>
              <span className="text-sm font-medium text-foreground">
                ₹
                {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>)}
            <div className="flex justify-between pt-2">
              <span className="font-semibold text-foreground">
                Total
              </span>
              <span className="text-lg font-bold gradient-text">
                ₹
                {order.amount.toLocaleString()}
              </span>
            </div>
          </div>
          <table className="w-full text-sm hidden sm:table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-xs font-medium text-muted-foreground">
                  Product
                </th>
                <th className="text-center py-2 text-xs font-medium text-muted-foreground">
                  Qty
                </th>
                <th className="text-right py-2 text-xs font-medium text-muted-foreground">
                  Price
                </th>
                <th className="text-right py-2 text-xs font-medium text-muted-foreground">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => <tr key={item.id} className="border-b border-border">
                <td className="py-3 text-foreground">
                  {item.name}
                </td>
                <td className="py-3 text-center text-muted-foreground">
                  {item.quantity}
                </td>
                <td className="py-3 text-right text-muted-foreground">
                  ₹
                  {item.price.toFixed(2)}
                </td>
                <td className="py-3 text-right font-medium text-foreground">
                  ₹
                  {(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>)}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="pt-4 text-right font-semibold text-foreground">
                  Total
                </td>
                <td className="pt-4 text-right text-lg font-bold gradient-text">
                  ₹
                  {order.amount.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div className="glass-card p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          Notes
        </h3>
        {notes.length > 0 ? <div className="space-y-2 mb-4">
          {notes.map((note, i) => <div
            key={i}
            className="flex items-start gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-surface-2 text-sm text-foreground">
            {editingIndex === i ? <div className="flex flex-1 flex-col gap-2 min-w-0 sm:flex-row sm:items-center">
              <input
                type="text"
                value={editDraft}
                onChange={(e) => setEditDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    saveEditedNote();
                  }
                  if (e.key === "Escape") cancelEditNote();
                }}
                autoFocus={true}
                className="flex-1 min-w-0 h-9 px-3 rounded-lg bg-background/80 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="flex shrink-0 gap-1 justify-end">
                <button
                  type="button"
                  onClick={saveEditedNote}
                  disabled={!editDraft.trim()}
                  aria-label="Save note"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-primary hover:bg-primary/15 disabled:opacity-40 disabled:pointer-events-none transition-colors">
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={cancelEditNote}
                  aria-label="Cancel editing"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted/60 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div> : <>
              <p className="flex-1 min-w-0 break-words leading-relaxed pt-0.5">
                {note}
              </p>
              <div className="flex shrink-0 gap-0.5">
                <button
                  type="button"
                  onClick={() => startEditNote(i)}
                  aria-label="Edit note"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteNote(i)}
                  aria-label="Delete note"
                  className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </>}
          </div>)}
        </div> : <p className="text-sm text-muted-foreground mb-4">
          No notes yet.
        </p>}
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
            placeholder="Add a note..."
            className="flex-1 h-9 px-3 sm:px-4 rounded-xl bg-surface-2 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button
            onClick={addNote}
            className="h-9 px-4 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default OrderDetails;
