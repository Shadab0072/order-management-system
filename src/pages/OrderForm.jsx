import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DUMMY_AGENTS, useOrders } from "@/context/OrderContext";
import { Plus, Trash2, ArrowLeft, ArrowRight, Check, User, ShoppingCart, ClipboardList, CalendarIcon, UserCog } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/cn";
const STEPS = [
  { label: "Customer Info", icon: User },
  { label: "Order Items", icon: ShoppingCart },
  { label: "Assign Agent", icon: UserCog },
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
  const [customerErrors, setCustomerErrors] = useState({});
  const [items, setItems] = useState(existing?.items || [
    { id: "1", name: "", quantity: 1, price: "" }
  ]);
  const [agentId, setAgentId] = useState(existing?.agent?.id || "");
  const lineTotal = (price, qty) => (Number(price) || 0) * qty;
  const total = items.reduce((s, i) => s + lineTotal(i.price, i.quantity), 0);
  const selectedAgent = DUMMY_AGENTS.find((a) => a.id === agentId);
  const addItem = () => {
    setItems([...items, { id: String(Date.now()), name: "", quantity: 1, price: "" }]);
  };
  const removeItem = (itemId) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== itemId));
  };
  const updateItem = (itemId, field, value) => {
    setItems(items.map((i) => i.id === itemId ? { ...i, [field]: value } : i));
  };
  const validateCustomer = () => {
    const errors = {};
    const name = customer.name.trim();
    const email = customer.email.trim();
    const phone = customer.phone.trim();
    const address = customer.address.trim();
    const city = customer.city.trim();
    const state = customer.state.trim();
    const zip = customer.zip.trim();
    if (!name) errors.name = "Name is required";
    else if (name.length < 2) errors.name = "Name must be at least 2 characters";
    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address";
    if (!phone) errors.phone = "Phone is required";
    else if (!/^\+?[\d\s-]{10,15}$/.test(phone)) errors.phone = "Enter a valid phone number";
    if (!address) errors.address = "Address is required";
    else if (address.length < 5) errors.address = "Address must be at least 5 characters";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!zip) errors.zip = "ZIP is required";
    else if (!/^\d{6}$/.test(zip)) errors.zip = "ZIP must be a 6-digit code";
    return errors;
  };
  const updateCustomerField = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (customerErrors[field]) {
      setCustomerErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };
  const canNext = () => {
    if (step === 0) return true;
    if (step === 1) return items.every((i) => !!i.name && i.quantity > 0);
    if (step === 2) return !!agentId;
    return true;
  };
  const handleNext = () => {
    if (step === 0) {
      const errors = validateCustomer();
      setCustomerErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    if (canNext()) setStep(step + 1);
  };
  const handleSubmit = () => {
    const errors = validateCustomer();
    setCustomerErrors(errors);
    if (Object.keys(errors).length > 0 || items.some((i) => !i.name) || !agentId) return;
    const agent = DUMMY_AGENTS.find((a) => a.id === agentId);
    if (!agent) return;
    const itemsToSave = items.map((i) => ({ ...i, price: Number(i.price) || 0 }));
    const amount = Math.round(
      itemsToSave.reduce((s, i) => s + i.price * i.quantity, 0) * 100
    ) / 100;
    if (existing) {
      updateOrder(existing.id, { customer, priority, items: itemsToSave, amount, agent });
    } else {
      addOrder({ customer, priority, items: itemsToSave, amount, status: "pending", notes: [], agent });
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
                className={cn(inputClass, customerErrors.name && "border-destructive focus:ring-destructive/30")}
                value={customer.name}
                onChange={(e) => updateCustomerField("name", e.target.value)}
                placeholder="John Doe" />
              {customerErrors.name && <p className="text-xs text-destructive mt-1">
                {customerErrors.name}
              </p>}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Email *
              </label>
              <input
                className={cn(inputClass, customerErrors.email && "border-destructive focus:ring-destructive/30")}
                type="email"
                value={customer.email}
                onChange={(e) => updateCustomerField("email", e.target.value)}
                placeholder="john@gmail.com" />
              {customerErrors.email && <p className="text-xs text-destructive mt-1">
                {customerErrors.email}
              </p>}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Phone *
              </label>
              <input
                className={cn(inputClass, customerErrors.phone && "border-destructive focus:ring-destructive/30")}
                value={customer.phone}
                onChange={(e) => updateCustomerField("phone", e.target.value)}
                placeholder="98765XXXXX (10 digits)" />
              {customerErrors.phone && <p className="text-xs text-destructive mt-1">
                {customerErrors.phone}
              </p>}
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
                Address *
              </label>
              <input
                className={cn(inputClass, customerErrors.address && "border-destructive focus:ring-destructive/30")}
                value={customer.address}
                onChange={(e) => updateCustomerField("address", e.target.value)}
                placeholder="120F VIP Road XXXX" />
              {customerErrors.address && <p className="text-xs text-destructive mt-1">
                {customerErrors.address}
              </p>}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                City *
              </label>
              <input
                className={cn(inputClass, customerErrors.city && "border-destructive focus:ring-destructive/30")}
                value={customer.city}
                onChange={(e) => updateCustomerField("city", e.target.value)}
                placeholder="City Name" />
              {customerErrors.city && <p className="text-xs text-destructive mt-1">
                {customerErrors.city}
              </p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  State *
                </label>
                <input
                  className={cn(inputClass, customerErrors.state && "border-destructive focus:ring-destructive/30")}
                  value={customer.state}
                  onChange={(e) => updateCustomerField("state", e.target.value)}
                  placeholder="State Name" />
                {customerErrors.state && <p className="text-xs text-destructive mt-1">
                  {customerErrors.state}
                </p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  ZIP *
                </label>
                <input
                  className={cn(inputClass, customerErrors.zip && "border-destructive focus:ring-destructive/30")}
                  value={customer.zip}
                  onChange={(e) => updateCustomerField("zip", e.target.value)}
                  placeholder="10XXXX (6 digits)" />
                {customerErrors.zip && <p className="text-xs text-destructive mt-1">
                  {customerErrors.zip}
                </p>}
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
                      value={item.price === "" ? "" : item.price}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === "") updateItem(item.id, "price", "");
                        else {
                          const n = parseFloat(v);
                          updateItem(item.id, "price", Number.isFinite(n) ? n : "");
                        }
                      }} />
                  </div>
                  <div className="flex items-center gap-2 pb-0.5">
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">
                      ₹
                      {lineTotal(item.price, item.quantity).toFixed(2)}
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
                    value={item.price === "" ? "" : item.price}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "") updateItem(item.id, "price", "");
                      else {
                        const n = parseFloat(v);
                        updateItem(item.id, "price", Number.isFinite(n) ? n : "");
                      }
                    }} />
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <span className="text-sm font-medium text-foreground">
                    ₹
                    {lineTotal(item.price, item.quantity).toFixed(2)}
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
                ₹
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>}
        {step === 2 && <div className="glass-card p-4 sm:p-6 animate-fade-in overflow-hidden relative">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div
            className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
          <div className="relative">
            <div className="flex items-start gap-3 mb-5">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/25">
                <UserCog className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Assign an agent
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Choose who owns this order for follow-ups, fulfillment, and customer contact.
                </p>
              </div>
            </div>
            <label className="text-xs text-muted-foreground mb-1.5 block">
              Agent *
            </label>
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className={cn(
                inputClass,
                !agentId && "text-muted-foreground"
              )}>
              <option value="">
                Select an agent…
              </option>
              {DUMMY_AGENTS.map((a) => <option key={a.id} value={a.id}>
                {a.name}
                {" — "}
                {a.role}
              </option>)}
            </select>
            {selectedAgent && <div
              className="mt-5 flex items-center gap-4 rounded-xl border border-border bg-surface-2/80 p-4 ring-1 ring-primary/15">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl gradient-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
                {selectedAgent.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">
                  {selectedAgent.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedAgent.role}
                </p>
              </div>
              <span
                className="hidden sm:inline-flex shrink-0 rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-primary border border-primary/20">
                Assigned
              </span>
            </div>}
          </div>
        </div>}
        {step === 3 && <div className="space-y-4 animate-fade-in">
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
                Assigned agent
              </h3>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs text-primary hover:underline">
                Edit
              </button>
            </div>
            {selectedAgent && <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gradient-primary text-xs font-bold text-primary-foreground">
                {selectedAgent.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {selectedAgent.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedAgent.role}
                </p>
              </div>
            </div>}
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
                  ₹
                  {lineTotal(item.price, item.quantity).toFixed(2)}
                </span>
              </div>)}
            </div>
            <div className="flex justify-end mt-3 pt-3 border-t border-border">
              <div className="text-right">
                <span className="text-sm text-muted-foreground">
                  {"Total: "}
                </span>
                <span className="text-xl font-bold gradient-text">
                  ₹
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
        {step < 3 ? <button
          type="button"
          onClick={handleNext}
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
