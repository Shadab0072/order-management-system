import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useTheme } from '../../context/ThemeContext'
import KanbanCard from './KanbanCard'

const KanbanColumn = ({ id, title, orders, colorClass }) => {
  const { isDark } = useTheme()
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col flex-1 w-full min-w-[280px] max-w-[350px] mx-2 rounded-xl transition-colors duration-200 ${
        isDark ? 'bg-gray-800' : 'bg-gray-50'
      } ${
        isOver
          ? isDark
            ? 'ring-2 ring-indigo-500 bg-gray-700'
            : 'ring-2 ring-indigo-300 bg-indigo-50'
          : 'border border-transparent'
      } border ${isDark ? 'border-gray-700' : 'border-gray-200'} shadow-sm`}
    >
      <div
        className={`px-4 py-3 rounded-t-xl mb-4 border-b ${
          isDark ? 'border-gray-700/50' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${colorClass}`} />
            <h3
              className={`font-semibold text-sm uppercase tracking-wider ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              {title}
            </h3>
          </div>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isDark
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {orders.length}
          </span>
        </div>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        <SortableContext items={orders.map(o => o.id)} strategy={verticalListSortingStrategy}>
          {orders.length === 0 ? (
            <div
              className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl mt-4 opacity-70 ${
                isDark ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'
              }`}
            >
              <div className="text-sm font-medium">No orders yet</div>
              <p className="text-xs text-center mt-1">Drag and drop orders here</p>
            </div>
          ) : (
            orders.map((order) => <KanbanCard key={order.id} order={order} />)
          )}
        </SortableContext>
      </div>
    </div>
  )
}

export default KanbanColumn
