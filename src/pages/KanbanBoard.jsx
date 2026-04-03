import React, { useMemo, useState } from "react";
import { useOrders } from "@/context/OrderContext";
import { cn } from "@/lib/cn";
import { Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
const columns = [
  { status: "pending", label: "Pending", color: "bg-warning" },
  { status: "in_progress", label: "In Progress", color: "bg-info" },
  { status: "completed", label: "Completed", color: "bg-success" }
];
const priorityDot = {
  low: "bg-muted-foreground",
  medium: "bg-info",
  high: "bg-warning",
  urgent: "bg-destructive"
};
function SortableCard({ order, colStatus }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: order.id,
    data: { status: colStatus }
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "glass-card p-3 sm:p-4 animate-slide-up group touch-manipulation",
        isDragging && "opacity-40 ring-2 ring-primary/40"
      )}>
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors cursor-grab active:cursor-grabbing shrink-0 touch-none">
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <Link
              to={`/orders/${order.id}`}
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              {order.id}
            </Link>
            <div className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", priorityDot[order.priority])} />
              <span className="text-[11px] text-muted-foreground capitalize">
                {order.priority}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2 truncate">
            {order.customer.name}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">
              ₹
              {order.amount.toLocaleString()}
            </span>
            <div
              className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              {columns.filter((c) => c.status !== colStatus).map((c) => <button
                key={c.status}
                onClick={() => {
                }}
                className="hidden sm:block px-2 py-1 text-[10px] font-medium rounded-md bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors">
                {"\u2192 "}
                {c.label}
              </button>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function OverlayCard({ order }) {
  return (
    <div
      className="glass-card p-3 sm:p-4 ring-2 ring-primary/50 shadow-xl rotate-2 scale-105">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 p-1 text-muted-foreground shrink-0">
          <GripVertical className="h-3.5 w-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-foreground">
              {order.id}
            </span>
            <div className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", priorityDot[order.priority])} />
              <span className="text-[11px] text-muted-foreground capitalize">
                {order.priority}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {order.customer.name}
          </p>
        </div>
      </div>
    </div>
  );
}
function DroppableColumn({
  col,
  orders,
  isOver
}) {
  return (
    <div
      className={cn(
        "flex flex-col min-w-[260px] sm:min-w-[280px] md:min-w-0 snap-center"
      )}>
      <div className="flex items-center gap-2 mb-3 sm:mb-4 px-1">
        <div className={cn("h-2.5 w-2.5 rounded-full", col.color)} />
        <h3 className="text-sm font-semibold text-foreground">
          {col.label}
        </h3>
        <span
          className="ml-auto text-xs text-muted-foreground bg-surface-2 px-2 py-0.5 rounded-full">
          {orders.length}
        </span>
      </div>
      <div
        className={cn(
          "flex-1 space-y-2 sm:space-y-3 rounded-xl p-2 transition-colors min-h-[120px]",
          isOver ? "bg-primary/5 ring-2 ring-primary/20 ring-dashed" : "bg-transparent"
        )}>
        <SortableContext items={orders.map((o) => o.id)} strategy={verticalListSortingStrategy}>
          {orders.map((order) => <SortableCard key={order.id} order={order} colStatus={col.status} />)}
        </SortableContext>
        {orders.length === 0 && !isOver && <div className="glass-card p-6 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Drop orders here
          </p>
        </div>}
      </div>
    </div>
  );
}
function MobileKanban({
  grouped,
  activeTab,
  setActiveTab,
  updateOrder
}) {
  return (
    <div className="md:hidden space-y-3">
      <div className="flex gap-1 p-1 rounded-xl bg-surface-2">
        {columns.map((col) => <button
          key={col.status}
          onClick={() => setActiveTab(col.status)}
          className={cn(
            "flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all text-center",
            activeTab === col.status ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}>
          <div className="flex items-center justify-center gap-1.5">
            <div className={cn("h-2 w-2 rounded-full", col.color)} />
            <span>
              {col.label}
            </span>
            <span className="text-[10px] opacity-60">
              (
              {grouped[col.status].length}
              )
            </span>
          </div>
        </button>)}
      </div>
      <div className="space-y-2">
        {grouped[activeTab].map((order) => <div key={order.id} className="glass-card p-3">
          <div className="flex items-center justify-between mb-2">
            <Link
              to={`/orders/${order.id}`}
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              {order.id}
            </Link>
            <div className="flex items-center gap-1.5">
              <div className={cn("h-2 w-2 rounded-full", priorityDot[order.priority])} />
              <span className="text-[11px] text-muted-foreground capitalize">
                {order.priority}
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3 truncate">
            {order.customer.name}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">
              ₹
              {order.amount.toLocaleString()}
            </span>
            <div className="flex gap-1">
              {columns.filter((c) => c.status !== activeTab).map((c) => <button
                key={c.status}
                onClick={() => updateOrder(order.id, { status: c.status })}
                className="px-2 py-1 text-[10px] font-medium rounded-md bg-surface-2 text-muted-foreground hover:text-foreground hover:bg-surface-3 transition-colors">
                {"\u2192 "}
                {c.label}
              </button>)}
            </div>
          </div>
        </div>)}
        {grouped[activeTab].length === 0 && <div className="glass-card p-8 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No orders
          </p>
        </div>}
      </div>
    </div>
  );
}
function KanbanBoard() {
  const { orders, updateOrder } = useOrders();
  const [activeId, setActiveId] = useState(null);
  const [overColumn, setOverColumn] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );
  const grouped = useMemo(() => {
    const map = { pending: [], in_progress: [], completed: [], cancelled: [] };
    orders.forEach((o) => map[o.status]?.push(o));
    return map;
  }, [orders]);
  const activeOrder = activeId ? orders.find((o) => o.id === activeId) : null;
  const handleDragStart = (event) => {
    setActiveId(String(event.active.id));
  };
  const handleDragOver = (event) => {
    const overId = event.over?.id;
    if (!overId) {
      setOverColumn(null);
      return;
    }
    const overData = event.over?.data?.current;
    if (overData?.status) {
      setOverColumn(overData.status);
    } else {
      const col = columns.find((c) => c.status === overId);
      if (col) setOverColumn(col.status);
    }
  };
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setOverColumn(null);
    if (!over) return;
    const activeData = active.data.current;
    const overData = over.data.current;
    let targetStatus = null;
    if (overData?.status) {
      targetStatus = overData.status;
    } else {
      const col = columns.find((c) => c.status === over.id);
      if (col) targetStatus = col.status;
    }
    if (targetStatus && activeData?.status !== targetStatus) {
      updateOrder(String(active.id), { status: targetStatus });
    }
  };
  return (
    <div className="animate-fade-in">
      <MobileKanban
        grouped={grouped}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        updateOrder={updateOrder} />
      <div className="hidden md:block">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-3 gap-4 lg:gap-6 min-h-[600px]">
            {columns.map((col) => <DroppableColumn
              key={col.status}
              col={col}
              orders={grouped[col.status]}
              isOver={overColumn === col.status} />)}
          </div>
          <DragOverlay dropAnimation={{ duration: 200, easing: "ease" }}>
            {activeOrder ? <OverlayCard order={activeOrder} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
export default KanbanBoard;
