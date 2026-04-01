import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Check, Plus, Trash2,
  ClipboardList, User, Eye, Package,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useApp } from '../context/AppContext'
import { formatCurrency } from '../utils/formatters'
import { STATUS_OPTIONS, PRIORITY_OPTIONS } from '../constants/status'

// ─── Constants ────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Customer',    icon: User },
  { id: 2, label: 'Items',       icon: Package },
  { id: 3, label: 'Basic Info',  icon: ClipboardList },
  { id: 4, label: 'Review',      icon: Eye },
]

const EMPTY_ITEM = { name: '', quantity: 1, price: '' }

const INITIAL_FORM = {
  date:     new Date().toISOString().split('T')[0],
  status:   'pending',
  priority: 'medium',
  notes:    '',
  // Customer
  customerName:    '',
  customerEmail:   '',
  customerPhone:   '',
  shippingAddress: '',
  assignedAgent:   '',
  // Items
  items: [{ ...EMPTY_ITEM }],
}

// ─── Validation ───────────────────────────────────────────────────────────────
const validateStep = (step, form) => {
  const errors = {}

  if (step === 1) {
    if (!form.customerName.trim())    errors.customerName    = 'Name is required'
    if (!form.customerEmail.trim())   errors.customerEmail   = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.customerEmail))
                                      errors.customerEmail   = 'Invalid email format'
    if (!form.customerPhone.trim())   errors.customerPhone   = 'Phone is required'
    if (!form.shippingAddress.trim()) errors.shippingAddress = 'Address is required'
  }

  if (step === 2) {
    form.items.forEach((item, i) => {
      if (!item.name.trim())          errors[`item_name_${i}`]  = 'Item name required'
      if (!item.price || item.price <= 0)
                                      errors[`item_price_${i}`] = 'Valid price required'
      if (!item.quantity || item.quantity < 1)
                                      errors[`item_qty_${i}`]   = 'Min quantity is 1'
    })
  }

  if (step === 3) {
    if (!form.date)     errors.date     = 'Date is required'
    if (!form.status)   errors.status   = 'Status is required'
    if (!form.priority) errors.priority = 'Priority is required'
  }

  return errors
}

// ─── Shared Input ─────────────────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
)

const inputCls = (isDark, error) =>
  `w-full px-3 py-2.5 rounded-lg text-sm border outline-none transition-colors
  ${error ? 'border-red-500 focus:border-red-400' : isDark ? 'border-gray-700 focus:border-indigo-500' : 'border-gray-200 focus:border-indigo-400'}
  ${isDark ? 'bg-gray-800 text-gray-200 placeholder-gray-600' : 'bg-white text-gray-800 placeholder-gray-400'}`

// ─── Step 3: Basic Info ───────────────────────────────────────────────────────
const StepBasicInfo = ({ form, errors, onChange, isDark }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field label="Order Date" error={errors.date}>
        <input type="date" value={form.date}
          onChange={(e) => onChange('date', e.target.value)}
          className={inputCls(isDark, errors.date)} />
      </Field>
      <Field label="Status" error={errors.status}>
        <select value={form.status} onChange={(e) => onChange('status', e.target.value)}
          className={inputCls(isDark, errors.status) + ' cursor-pointer'}>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </Field>
      <Field label="Priority" error={errors.priority}>
        <select value={form.priority} onChange={(e) => onChange('priority', e.target.value)}
          className={inputCls(isDark, errors.priority) + ' cursor-pointer'}>
          {PRIORITY_OPTIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </Field>
    </div>
    <Field label="Notes (optional)">
      <textarea
        value={form.notes}
        onChange={(e) => onChange('notes', e.target.value)}
        rows={4}
        placeholder="Any special instructions or notes…"
        className={inputCls(isDark, null) + ' resize-none'}
      />
    </Field>
  </div>
)

// ─── Step 2: Customer ─────────────────────────────────────────────────────────
const StepCustomer = ({ form, errors, onChange, isDark }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <Field label="Full Name" error={errors.customerName}>
        <input type="text" value={form.customerName} placeholder="Rahul Sharma"
          onChange={(e) => onChange('customerName', e.target.value)}
          className={inputCls(isDark, errors.customerName)} />
      </Field>
      <Field label="Email" error={errors.customerEmail}>
        <input type="email" value={form.customerEmail} placeholder="rahul@example.com"
          onChange={(e) => onChange('customerEmail', e.target.value)}
          className={inputCls(isDark, errors.customerEmail)} />
      </Field>
      <Field label="Phone" error={errors.customerPhone}>
        <input type="tel" value={form.customerPhone} placeholder="+91 98765 43210"
          onChange={(e) => onChange('customerPhone', e.target.value)}
          className={inputCls(isDark, errors.customerPhone)} />
      </Field>
      <Field label="Assigned Agent (optional)">
        <input type="text" value={form.assignedAgent} placeholder="Agent name"
          onChange={(e) => onChange('assignedAgent', e.target.value)}
          className={inputCls(isDark, null)} />
      </Field>
    </div>
    <Field label="Shipping Address" error={errors.shippingAddress}>
      <textarea rows={3} value={form.shippingAddress} placeholder="12 MG Road, Bangalore, KA 560001"
        onChange={(e) => onChange('shippingAddress', e.target.value)}
        className={inputCls(isDark, errors.shippingAddress) + ' resize-none'} />
    </Field>
  </div>
)

// ─── Step 3: Items ────────────────────────────────────────────────────────────
const StepItems = ({ form, errors, onItemChange, onAddItem, onRemoveItem, isDark }) => {
  const total = form.items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0)

  return (
    <div className="space-y-4">
      {form.items.map((item, i) => (
        <div key={i} className={`rounded-xl border p-4 space-y-4 ${isDark ? 'border-gray-800 bg-gray-800/30' : 'border-gray-100 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Item {i + 1}
            </span>
            {form.items.length > 1 && (
              <button onClick={() => onRemoveItem(i)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors">
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <Field label="Item Name" error={errors[`item_name_${i}`]}>
                <input type="text" value={item.name} placeholder="Product name"
                  onChange={(e) => onItemChange(i, 'name', e.target.value)}
                  className={inputCls(isDark, errors[`item_name_${i}`])} />
              </Field>
            </div>
            <Field label="Quantity" error={errors[`item_qty_${i}`]}>
              <input type="number" min={1} value={item.quantity}
                onChange={(e) => onItemChange(i, 'quantity', e.target.value)}
                className={inputCls(isDark, errors[`item_qty_${i}`])} />
            </Field>
            <Field label="Price (₹)" error={errors[`item_price_${i}`]}>
              <input type="number" min={0} value={item.price} placeholder="0"
                onChange={(e) => onItemChange(i, 'price', e.target.value)}
                className={inputCls(isDark, errors[`item_price_${i}`])} />
            </Field>
          </div>
        </div>
      ))}

      <button onClick={onAddItem}
        className={`w-full py-2.5 rounded-xl border-2 border-dashed text-sm font-medium flex items-center justify-center gap-2 transition-colors
          ${isDark ? 'border-gray-700 text-gray-500 hover:border-indigo-500 hover:text-indigo-400' : 'border-gray-200 text-gray-400 hover:border-indigo-400 hover:text-indigo-500'}`}>
        <Plus size={15} /> Add Another Item
      </button>

      {form.items.some((item) => item.price && item.quantity) && (
        <div className={`flex justify-between items-center px-4 py-3 rounded-xl ${isDark ? 'bg-indigo-900/30 text-white' : 'bg-indigo-50 text-gray-900'}`}>
          <span className="text-sm font-semibold">Order Total</span>
          <span className="text-base font-bold text-indigo-500">{formatCurrency(total)}</span>
        </div>
      )}
    </div>
  )
}

// ─── Step 4: Review ───────────────────────────────────────────────────────────
const StepReview = ({ form, onEdit, isDark }) => {
  const total = form.items.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.quantity) || 0), 0)

  const ReviewBlock = ({ title, stepIndex, rows }) => (
    <div className={`rounded-xl border p-5 ${isDark ? 'bg-gray-800/40 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</span>
        <button onClick={() => onEdit(stepIndex)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Edit
        </button>
      </div>
      <dl className="space-y-2">
        {rows.map(([label, value]) => value ? (
          <div key={label} className="flex gap-3">
            <dt className={`text-xs w-28 flex-shrink-0 pt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</dt>
            <dd className={`text-sm font-medium flex-1 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{value}</dd>
          </div>
        ) : null)}
      </dl>
    </div>
  )

  return (
    <div className="space-y-4">
      <ReviewBlock title="Customer" stepIndex={1} rows={[
        ['Name',     form.customerName],
        ['Email',    form.customerEmail],
        ['Phone',    form.customerPhone],
        ['Address',  form.shippingAddress],
        ['Agent',    form.assignedAgent || '—'],
      ]} />
      <div className={`rounded-xl border p-5 ${isDark ? 'bg-gray-800/40 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Items</span>
          <button onClick={() => onEdit(2)} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Edit</button>
        </div>
        {form.items.filter((i) => i.name).map((item, i) => (
          <div key={i} className={`flex justify-between py-2 border-b last:border-0 ${isDark ? 'border-gray-700' : 'border-gray-100'}`}>
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item.name} × {item.quantity}</span>
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCurrency(Number(item.price) * Number(item.quantity))}</span>
          </div>
        ))}
        <div className="flex justify-between pt-3 mt-1">
          <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Total</span>
          <span className="text-base font-bold text-indigo-500">{formatCurrency(total)}</span>
        </div>
      </div>
      <ReviewBlock title="Basic Info" stepIndex={3} rows={[
        ['Date',     form.date],
        ['Status',   form.status],
        ['Priority', form.priority],
        ['Notes',    form.notes || '—'],
      ]} />
    </div>
  )
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep, isDark }) => (
  <div className="flex items-center gap-0">
    {STEPS.map((step, i) => {
      const isCompleted = currentStep > step.id
      const isActive    = currentStep === step.id
      const Icon = step.icon

      return (
        <div key={step.id} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200
              ${isCompleted ? 'bg-indigo-600 text-white'
                : isActive  ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20'
                : isDark    ? 'bg-gray-800 text-gray-600 border border-gray-700'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'}`}>
              {isCompleted ? <Check size={15} /> : <Icon size={15} />}
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${
              isActive || isCompleted
                ? isDark ? 'text-white' : 'text-gray-900'
                : isDark ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-5 ${
              currentStep > step.id ? 'bg-indigo-600' : isDark ? 'bg-gray-800' : 'bg-gray-200'
            }`} />
          )}
        </div>
      )
    })}
  </div>
)

// ─── Create Order Page ────────────────────────────────────────────────────────
const CreateOrder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { orders, addOrder, updateOrder } = useApp()
  const isEditMode = Boolean(id)

  // Pre-fill form in edit mode — read from live context orders
  const existingOrder = useMemo(() => orders.find((o) => String(o.id) === String(id)), [id, orders])

  const [step, setStep]     = useState(1)
  const [form, setForm]     = useState(() => {
    if (isEditMode && existingOrder) {
      return {
        date:            existingOrder.createdAt       ? new Date(existingOrder.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status:          existingOrder.status          || 'pending',
        priority:        existingOrder.priority        || 'medium',
        notes:           existingOrder.notes           || '',
        customerName:    existingOrder.customerName    || '',
        customerEmail:   existingOrder.customerEmail   || '',
        customerPhone:   existingOrder.customerPhone   || '',
        shippingAddress: existingOrder.shippingAddress || '',
        assignedAgent:   existingOrder.assignedAgent   || '',
        items:           existingOrder.items?.length   ? existingOrder.items : [{ ...EMPTY_ITEM }],
      }
    }
    return INITIAL_FORM
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const onItemChange = (index, key, value) => {
    setForm((prev) => {
      const items = [...prev.items]
      items[index] = { ...items[index], [key]: value }
      return { ...prev, items }
    })
    setErrors((prev) => ({ ...prev, [`item_${key}_${index}`]: undefined }))
  }

  const onAddItem    = () => setForm((prev) => ({ ...prev, items: [...prev.items, { ...EMPTY_ITEM }] }))
  const onRemoveItem = (i) => setForm((prev) => ({ ...prev, items: prev.items.filter((_, idx) => idx !== i) }))

  const goNext = () => {
    const errs = validateStep(step, form)
    if (Object.keys(errs).length > 0) return setErrors(errs)
    setErrors({})
    setStep((s) => s + 1)
  }

  const goBack = () => {
    setErrors({})
    setStep((s) => s - 1)
  }

  const handleSubmit = () => {
    // Call context action — this updates global state instantly
    if (isEditMode) {
      updateOrder(id, form)
    } else {
      addOrder(form)
    }
    setSubmitted(true)
    setTimeout(() => navigate('/orders'), 1500)
  }

  // ── Success Screen ──
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center">
          <Check size={28} className="text-white" />
        </div>
        <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Order {isEditMode ? 'Updated' : 'Created'}!
        </p>
        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Redirecting to orders…</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/orders')}
          className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}>
          <ArrowLeft size={18} />
        </button>
        <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {isEditMode ? 'Edit Order' : 'Create New Order'}
        </h2>
      </div>

      {/* ── Step Indicator ── */}
      <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <StepIndicator currentStep={step} isDark={isDark} />
      </div>

      {/* ── Form Card ── */}
      <div className={`rounded-xl border p-6 ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <p className={`text-base font-semibold mb-5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {STEPS[step - 1].label}
        </p>

        {step === 1 && <StepCustomer   form={form} errors={errors} onChange={onChange} isDark={isDark} />}
        {step === 2 && <StepItems      form={form} errors={errors} onItemChange={onItemChange} onAddItem={onAddItem} onRemoveItem={onRemoveItem} isDark={isDark} />}
        {step === 3 && <StepBasicInfo  form={form} errors={errors} onChange={onChange} isDark={isDark} />}
        {step === 4 && <StepReview     form={form} onEdit={(s) => setStep(s)} isDark={isDark} />}
      </div>

      {/* ── Navigation ── */}
      <div className="flex justify-between">
        <button
          onClick={step === 1 ? () => navigate('/orders') : goBack}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
            ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
        >
          <ArrowLeft size={15} />
          {step === 1 ? 'Cancel' : 'Back'}
        </button>

        {step < 4 ? (
          <button onClick={goNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
            Next <ArrowRight size={15} />
          </button>
        ) : (
          <button onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
            <Check size={15} />
            {isEditMode ? 'Save Changes' : 'Create Order'}
          </button>
        )}
      </div>
    </div>
  )
}

export default CreateOrder