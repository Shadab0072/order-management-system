import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrders } from "@/context/OrderContext";
import { Plus, Trash2, ArrowLeft, ArrowRight, Check, User, ShoppingCart, ClipboardList, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/cn";
const STEPS = [
  { label: "Customer Info", icon: User },
  { label: "Order Items", icon: ShoppingCart },
  { label: "Review", icon: ClipboardList }
];
function OrderForm() {
  const { id } = useParams();
  const { orders, addOrder, updateOrder } = useOrders();
  const navigate = useNavigate();
  const existing = id ? orders.find((o) => o.id === id) : null;
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState(existing?.customer || {
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: ""
  });
  const [orderDate, setOrderDate] = useState(existing ? new Date(existing.date) : new Date());
  const [priority, setPriority] = useState(existing?.priority || "medium");
  const [items, setItems] = useState(existing?.items || [
    { id: "1", name: "", quantity: 1, price: 0 }
  ]);
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const addItem = () => {
    setItems([...items, { id: String(Date.now()), name: "", quantity: 1, price: 0 }]);
  };
  const removeItem = (itemId) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== itemId));
  };
  const updateItem = (itemId, field, value) => {
    setItems(items.map((i) => i.id === itemId ? { ...i, [field]: value } : i));
  };
  const canNext = () => {
    if (step === 0) return !!customer.name && !!customer.email;
    if (step === 1) return items.every((i) => !!i.name && i.quantity > 0);
    return true;
  };
  const handleSubmit = () => {
    if (!customer.name || !customer.email || items.some((i) => !i.name)) return;
    if (existing) {
      updateOrder(existing.id, { customer, priority, items, amount: Math.round(total * 100) / 100 });
    } else {
      addOrder({ customer, priority, items, amount: Math.round(total * 100) / 100, status: "pending", notes: [] });
    }
    navigate("/orders");
  };
  const inputClass = "w-full h-9 px-3 sm:px-4 rounded-xl bg-surface-2 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30";
  const priorityColors = {
    low: "text-emerald-400",
    medium: "text-amber-400",
    high: "text-orange-400",
    urgent: "text-red-400"
  };
  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          {existing ? `Edit ${existing.id}` : "Create Order"}
        </h2>
      </div>
      <div className="glass-card p-3 sm:p-4">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => <div key={i} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => {
                if (i < step || canNext()) setStep(i);
              }}
              className={cn(
                "flex items-center gap-2 sm:gap-3 transition-all",
                i <= step ? "opacity-100" : "opacity-40"
              )}>
              <div
                className={cn(
                    "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0",
                    i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary/20 text-primary border-2 border-primary" : "bg-surface-2 text-muted-foreground border border-border"
                  )}>
                {i < step ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              </div>
              <span className="hidden sm:block text-xs font-medium text-foreground">
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && <div
              className={cn(
                "flex-1 h-px mx-2 sm:mx-4 transition-colors",
                i < step ? "bg-primary" : "bg-border"
              )} />}
          </div>)}
        </div>
      </div>
      <div className="min-h-[300px]">
        {step === 0 && <div className="glass-card p-4 sm:p-6 animate-fade-in">
          <h3 className="text-sm font-semibold text-foreground mb-4">
            Customer Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Name *
              </label>
              <input
                className={inputClass}
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                placeholder="John Doe" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Email *
              </label>
              <input
                className={inputClass}
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                placeholder="john@gmail.com" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Phone
              </label>
              <input
                className={inputClass}
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                placeholder="+91 98765 XXXXX" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Order Date
              </label>
              <Popover>
                <PopoverTrigger asChild={true}>
                  <button
                    type="button"
                    className={cn(inputClass, "flex items-center justify-between text-left", !orderDate && "text-muted-foreground")}>
                    {orderDate ? format(orderDate, "PPP") : "Pick a date"}
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={orderDate}
                    onSelect={setOrderDate}
                    initialFocus={true}
                    className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={inputClass}>
                <option value="low">
                  Low
                </option>
                <option value="medium">
                  Medium
                </option>
                <option value="high">
                  High
                </option>
                <option value="urgent">
                  Urgent
                </option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Address
              </label>
              <input
                className={inputClass}
                value={customer.address}
                onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                placeholder="120F VIP Road XXXX" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                City
              </label>
              <input
                className={inputClass}
                value={customer.city}
                onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                placeholder="Lucknow" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  State
                </label>
                <input
                  className={inputClass}
                  value={customer.state}
                  onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                  placeholder="UP" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  ZIP
                </label>
                <input
                  className={inputClass}
                  value={customer.zip}
                  onChange={(e) => setCustomer({ ...customer, zip: e.target.value })}
                  placeholder="10XXXX" />
              </div>
            </div>
          </div>
        </div>}
        {step === 1 && <div className="glass-card p-4 sm:p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Order Items
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-xs text-primary hover:underline">
              <Plus className="h-3.5 w-3.5" />
              {" Add Item"}
            </button>
          </div>
          <div className="space-y-3">
            {items.map((item, i) => <div key={item.id}>
              <div className="sm:hidden space-y-2">
                <div>
                  {i === 0 && <label className="text-xs text-muted-foreground mb-1 block">
                    Product *
                  </label>}
                  <input
                    className={inputClass}
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    placeholder="Product name" />
                </div>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    {i === 0 && <label className="text-xs text-muted-foreground mb-1 block">
                      Qty
                    </label>}
                    <input
                      className={inputClass}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)} />
                  </div>
                  <div className="flex-1">
                    {i === 0 && <label className="text-xs text-muted-foreground mb-1 block">
                      Price
                    </label>}
                    <input
                      className={inputClass}
                      type="number"
                      min={0}
                      step={0.01}
                      value={item.price}
                      onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)} />
                  </div>
                  <div className="flex items-center gap-2 pb-0.5">
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">
                      $
                      {(item.price * item.quantity).toFixed(2)}
                    </span>
                    {items.length > 1 && <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>}
                  </div>
                </div>
              </div>
              <div className="hidden sm:grid grid-cols-12 gap-3 items-end">
                <div className="col-span-5">
                  {i === 0 && <label className="text-xs text-muted-foreground mb-1 block">
                    Product *
                  </label>}
                  <input
                    className={inputClass}
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    placeholder="Product name" />
                </div>
                <div className="col-span-2">
                  {i === 0 && <label className="text-xs text-muted-foreground mb-1 block">
                    Qty
                  </label>}
                  <input
                    className={inputClass}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)} />
                </div>
                <div className="col-span-3">
                  {i === 0 && <label className="text-xs text-muted-foreground mb-1 block">
                    Price
                  </label>}
                  <input
                    className={inputClass}
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.price}
                    onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)} />
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <span className="text-sm font-medium text-foreground">
                    $
                    {(item.price * item.quantity).toFixed(2)}
                  </span>
                  {items.length > 1 && <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>}
                </div>
              </div>
            </div>)}
          </div>
          <div className="flex justify-end mt-4 pt-4 border-t border-border">
            <div className="text-right">
              <span className="text-sm text-muted-foreground">
                {"Total: "}
              </span>
              <span className="text-xl font-bold gradient-text">
                $
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>}
        {step === 2 && <div className="space-y-4 animate-fade-in">
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                Customer
              </h3>
              <button
                type="button"
                onClick={() => setStep(0)}
                className="text-xs text-primary hover:underline">
                Edit
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">
                  Name:
                </span>
                {" "}
                <span className="text-foreground">
                  {customer.name}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">
                  Email:
                </span>
                {" "}
                <span className="text-foreground">
                  {customer.email}
                </span>
              </div>
              {customer.phone && <div>
                <span className="text-muted-foreground">
                  Phone:
                </span>
                {" "}
                <span className="text-foreground">
                  {customer.phone}
                </span>
              </div>}
              {orderDate && <div>
                <span className="text-muted-foreground">
                  Date:
                </span>
                {" "}
                <span className="text-foreground">
                  {format(orderDate, "PPP")}
                </span>
              </div>}
              <div>
                <span className="text-muted-foreground">
                  Priority:
                </span>
                {" "}
                <span className={priorityColors[priority] + " capitalize"}>
                  {priority}
                </span>
              </div>
              {customer.address && <div className="sm:col-span-2">
                <span className="text-muted-foreground">
                  Address:
                </span>
                {" "}
                <span className="text-foreground">
                  {[customer.address, customer.city, customer.state, customer.zip].filter(Boolean).join(", ")}
                </span>
              </div>}
            </div>
          </div>
          <div className="glass-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">
                Items (
                {items.length}
                )
              </h3>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-primary hover:underline">
                Edit
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item) => <div
                key={item.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <span className="text-sm text-foreground font-medium">
                    {item.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {"\xD7 "}
                    {item.quantity}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">
                  $
                  {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>)}
            </div>
            <div className="flex justify-end mt-3 pt-3 border-t border-border">
              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  {"Total: "}
                </span>
                <span className="text-xl font-bold gradient-text">
                  $
                  {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>}
      </div>
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
        <button
          type="button"
          onClick={() => step === 0 ? navigate(-1) : setStep(step - 1)}
          className="h-10 px-6 rounded-xl bg-surface-2 text-sm font-medium text-foreground hover:bg-surface-3 transition-colors flex items-center justify-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          {step === 0 ? "Cancel" : "Back"}
        </button>
        {step < 2 ? <button
          type="button"
          onClick={() => canNext() && setStep(step + 1)}
          disabled={!canNext()}
          className="h-10 px-6 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
          {"Next "}
          <ArrowRight className="h-4 w-4" />
        </button> : <button
          type="button"
          onClick={handleSubmit}
          className="h-10 px-6 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Check className="h-4 w-4" />
          {existing ? "Update Order" : "Create Order"}
        </button>}
      </div>
    </div>
  );
}
export default OrderForm;
