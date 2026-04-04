import { useParams, Link, useNavigate } from "react-router-dom";
import { useOrders } from "@/context/OrderContext";
import { ArrowLeft, CheckCircle2, Circle, MapPin, Mail, Phone, Plus, UserCog } from "lucide-react";
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
  const addNote = () => {
    if (!newNote.trim()) return;
    updateOrder(order.id, { notes: [...order.notes, newNote.trim()] });
    setNewNote("");
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
        {order.notes.length > 0 ? <div className="space-y-2 mb-4">
          {order.notes.map((note, i) => <div
            key={i}
            className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-surface-2 text-sm text-foreground">
            {note}
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
