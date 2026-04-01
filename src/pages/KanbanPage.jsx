import { useState, useMemo } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import KanbanColumn from '../components/kanban/KanbanColumn'
import KanbanCard from '../components/kanban/KanbanCard'

const COLUMNS = [
  { id: 'pending', title: 'Pending', colorClass: 'bg-yellow-500' },
  { id: 'in_progress', title: 'In Progress', colorClass: 'bg-blue-500' },
  { id: 'completed', title: 'Completed', colorClass: 'bg-green-500' },
  { id: 'cancelled', title: 'Cancelled', colorClass: 'bg-red-500' },
]

const KanbanPage = () => {
  const { isDark } = useTheme()
  const { orders, updateOrderStatus } = useApp()
  const [activeId, setActiveId] = useState(null)

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px drag before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const activeOrder = useMemo(
    () => orders.find((o) => o.id === activeId),
    [activeId, orders]
  )

  const handleDragStart = (event) => {
    const { active } = event
    setActiveId(active.id)
  }

  const handleDragOver = (event) => {
    const { active, over } = event
    if (!over) return

    // Since we're keeping it simple and just changing the status on end,
    // we don't necessarily need to move the item during drag over unless
    // we want a highly visual preview.
  }

  const handleDragEnd = (event) => {
    setActiveId(null)
    const { active, over } = event

    if (!over) return

    const activeOrderId = active.id
    const overId = over.id // This could be a column id OR another card's id

    // Find the current status of the dropped item
    const activeItem = orders.find((o) => o.id === activeOrderId)
    if (!activeItem) return

    // Determine the new status
    let newStatus = activeItem.status
    
    // Check if we dropped over a column
    if (COLUMNS.map(c => c.id).includes(overId)) {
      newStatus = overId
    } else {
      // Over another card, use that card's status
      const overItem = orders.find((o) => o.id === overId)
      if (overItem) {
        newStatus = overItem.status
      }
    }

    if (activeItem.status !== newStatus) {
      updateOrderStatus(activeOrderId, newStatus)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className={`p-6 flex-1 overflow-x-auto ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex h-full min-w-max pb-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                colorClass={col.colorClass}
                orders={orders.filter((o) => o.status === col.id)}
              />
            ))}

            <DragOverlay>
              {activeOrder ? <KanbanCard order={activeOrder} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

export default KanbanPage
