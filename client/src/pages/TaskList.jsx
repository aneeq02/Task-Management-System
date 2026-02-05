import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { taskService } from '../services/taskService';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const LIMIT = 10;
const STATUSES = ['Pending', 'In Progress', 'Completed'];

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: LIMIT, total: 0, totalPages: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const isFocusMode = Boolean(statusFilter);

  const fetchTasks = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError('');
      try {
        const params = { page, limit: LIMIT };
        if (search) params.search = search;
        const { data } = await taskService.getTasks(params);
        setTasks(data.tasks);
        setPagination(data.pagination);
      } catch (err) {
        const message = err.response?.data?.error || 'Failed to load tasks.';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [search]
  );

  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const handlePageChange = (newPage) => {
    fetchTasks(newPage);
  };

  const handleTaskCreated = () => {
    setShowForm(false);
    fetchTasks(pagination.page);
  };

  const handleTaskUpdated = () => {
    setEditingTask(null);
    fetchTasks(pagination.page);
  };

  const handleTaskDeleted = () => {
    fetchTasks(pagination.page);
  };

  const openEdit = (task) => {
    setEditingTask(task);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const DRAG_CARD_WIDTH = 'clamp(260px, 28vw, 340px)';

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceStatus = source.droppableId.replace('column-', '');
    const destStatus = destination.droppableId.replace('column-', '');

    if (sourceStatus === destStatus && source.index === destination.index) return;

    const prevTasks = tasks;
    const updatedTasks = tasks.map((task) =>
      task._id === draggableId ? { ...task, status: destStatus } : task
    );
    setTasks(updatedTasks);

    try {
      await taskService.updateTask(draggableId, { status: destStatus });
      toast.success('Task status updated');
    } catch (err) {
      setTasks(prevTasks);
      toast.error(err.response?.data?.error || 'Failed to move task.');
    }
  };


  const tasksByStatus = STATUSES.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {});

  const getColumnClasses = (status, isDraggingOver) => {
    const isFocused = statusFilter === status;
    const isCollapsed = isFocusMode && !isFocused;

    const base =
      `rounded-xl border shadow-card bg-white/95 p-3 flex flex-col min-h-[120px] transition-[max-width,flex-basis,opacity] duration-300 ease-out
       dark:bg-primary-600/40 dark:border-primary-700`;

    const dragOver = isDraggingOver
      ? `border-accent-400 bg-sand-50 dark:bg-primary-900/40`
      : `border-sand-200`;

    const focusLayout = isFocusMode
      ? isFocused
        ? `md:flex-[1_1_0%] md:max-w-none`
        : `hidden md:flex md:flex-[0_0_3.75rem] md:max-w-[3.75rem] opacity-80 hover:opacity-100`
      : `md:flex-[1_1_0%] md:max-w-none`;

    return `${base} ${dragOver} ${focusLayout}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-3xl font-extrabold text-primary-700 tracking-tight dark:text-sand-50">
          My Tasks
        </h2>

        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-500 text-primary-900 font-semibold hover:bg-accent-600 transition shadow-soft text-sm md:text-base"
        >
          <span className="text-lg">+</span> New Task
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-3">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search tasks..."
            className="flex-1 px-4 py-3 rounded-xl border border-sand-300 bg-sand-50/40 focus:ring-2 focus:ring-accent-400 focus:border-accent-400 outline-none text-sm md:text-base
                       dark:border-primary-700 dark:bg-primary-900/40 dark:text-sand-50 dark:placeholder-secondary-400"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-primary-600 text-accent-100 font-medium hover:bg-primary-700 transition-shadow shadow-card hover:shadow-soft text-sm md:text-base"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-2 sm:justify-end items-center">
          {['', ...STATUSES].map((value) => {
            const label = value || 'All';
            const isActive = statusFilter === value;

            return (
              <button
                key={label}
                type="button"
                onClick={() => setStatusFilter(value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${isActive
                  ? 'bg-primary-600 text-accent-100 border-primary-600 shadow-soft'
                  : 'bg-white/80 text-secondary-700 border-sand-300 hover:bg-sand-100/80 dark:bg-primary-900/30 dark:text-secondary-200 dark:border-primary-700 dark:hover:bg-primary-900/45'
                  }`}
              >
                {label}
              </button>
            );
          })}

        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-600 animate-fade-in dark:bg-red-900/20 dark:text-red-200">
          {error}
        </div>
      )}

      {showForm && <TaskForm onSuccess={handleTaskCreated} onCancel={closeForm} />}

      {editingTask && <TaskForm task={editingTask} onSuccess={handleTaskUpdated} onCancel={closeForm} />}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 bg-white/90 rounded-xl border border-sand-200 shadow-card animate-fade-in dark:bg-primary-800/70 dark:border-primary-700">
          <p className="text-secondary-600 dark:text-secondary-200">No tasks yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-primary-600 font-semibold hover:text-primary-700 dark:text-accent-400 dark:hover:text-accent-300"
          >
            Create your first task
          </button>
        </div>
      ) : (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col md:flex-row gap-4">
              {STATUSES.map((status) => (
                <Droppable droppableId={`column-${status}`} key={status}>
                  {(provided, snapshot) => {
                    const isFocused = statusFilter === status;
                    const isCollapsed = isFocusMode && !isFocused;

                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={getColumnClasses(status, snapshot.isDraggingOver)}
                        aria-label={`${status} column`}
                      >
                        <div className={`flex items-center justify-between mb-2 ${isCollapsed ? 'flex-col gap-2' : ''}`}>

                          <h3
                            className={`text-sm font-semibold text-secondary-700 dark:text-secondary-200 ${isCollapsed ? 'text-xs text-center' : ''
                              }`}
                            title={status}
                          >
                            {isCollapsed ? status.split(' ')[0][0] : status}
                          </h3>

                          <span
                            className={`text-xs px-2 py-0.5 rounded-full bg-sand-100 text-secondary-600 dark:bg-primary-900/40 dark:text-secondary-200 ${isCollapsed ? 'px-2 py-1' : ''
                              }`}
                            title={`${tasksByStatus[status]?.length || 0} tasks`}
                          >
                            {tasksByStatus[status]?.length || 0}
                          </span>
                        </div>

                        <div className={`space-y-3 ${isCollapsed ? 'overflow-hidden' : ''}`}>
                          {(tasksByStatus[status] || []).map((task, index) => (
                            <Draggable key={task._id} draggableId={task._id} index={index}>
                              {(dragProvided, dragSnapshot) => {
                                const baseStyle = dragProvided.draggableProps.style;

                                const dragStyle =
                                  isFocusMode && dragSnapshot.isDragging
                                    ? {
                                      ...baseStyle,
                                      width: DRAG_CARD_WIDTH,
                                      maxWidth: DRAG_CARD_WIDTH,
                                    }
                                    : baseStyle;

                                return (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    style={dragStyle}
                                    className={isCollapsed ? 'pointer-events-none opacity-0 h-0 overflow-hidden' : ''}
                                  >
                                    <TaskCard task={task} onEdit={openEdit} onDelete={handleTaskDeleted} />
                                  </div>
                                );
                              }}
                            </Draggable>
                          ))}

                          {provided.placeholder}

                          {isCollapsed && (
                            <div className="flex-1 flex items-center justify-center py-6">
                              <span className="text-[10px] text-secondary-500 dark:text-secondary-300 text-center px-1">
                                Drop
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }}
                </Droppable>
              ))}
            </div>
          </DragDropContext>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 rounded-lg border border-sand-300 text-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sand-100/80
                           dark:border-primary-700 dark:text-secondary-200 dark:hover:bg-primary-900/40"
              >
                Previous
              </button>
              <span className="text-sm text-secondary-600 dark:text-secondary-200">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                className="px-3 py-1.5 rounded-lg border border-sand-300 text-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sand-100/80
                           dark:border-primary-700 dark:text-secondary-200 dark:hover:bg-primary-900/40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
