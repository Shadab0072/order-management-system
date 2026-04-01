import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTheme } from '../../context/ThemeContext'
// import Badge from '../ui/Badge'
import {Card} from '../ui/Card'

const KanbanCard = ({ order }) => {
  const { isDark } = useTheme()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: order.id,
    data: {
      type: 'Order',
      order,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Priority color
  const priorityColors = {
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={`rounded-xl mb-3 opacty-50 border-2 border-indigo-500 overflow-hidden ${
          isDark ? 'bg-gray-800' : 'bg-gray-50'
        }`}
      >
        <Card className="p-4 opacity-0">
          <div className="h-20" />
        </Card>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-3 cursor-grab active:cursor-grabbing transition-transform duration-200 ease-out hover:-translate-y-1 ${
        isDark ? 'shadow-[0_4px_12px_rgba(0,0,0,0.5)]' : 'shadow-sm hover:shadow-md'
      }`}
    >
      <Card className={`p-4 relative overflow-hidden group border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
        <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-50 group-hover:opacity-100 transition-opacity`} />
        
        <div className="flex justify-between items-start mb-2 pl-2">
          <div>
            <span className={`text-xs font-semibold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{order.orderId}</span>
            <h4 className={`font-medium mt-1 truncate max-w-[140px] ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{order.customerName}</h4>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[order.priority] || priorityColors.medium}`}>
            {order.priority ? order.priority.charAt(0).toUpperCase() + order.priority.slice(1) : 'Medium'}
          </span>
        </div>

        <div className="flex justify-between items-center mt-4 pl-2">
          <div className="flex flex-col">
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Amount</span>
            <span className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>₹{order.totalAmount?.toLocaleString('en-IN') || '0'}</span>
          </div>
          <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB') : ''}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default KanbanCard
