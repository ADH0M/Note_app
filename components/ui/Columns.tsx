'use client';
import { Prisma } from '@/generated/prisma';
import Column from './Column';

import { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import { updateTaskPosition } from '@/lib/actions/notes-action';
import { DragDropProvider, DragOverlay } from '@dnd-kit/react';

type ColumnWithTasks = Prisma.ColumnGetPayload<{
  include: { tasks: true }
}>

const Columns = ({columns: initialColumns}: {columns: ColumnWithTasks[]}) => {
  const [columns, setColumns] = useState<ColumnWithTasks[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Prisma.TaskGetPayload<object> | null>(null);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //       activationConstraint: {
  //           distance: 5, // 5px movement required to start drag
  //       },
  //   }),
  //   useSensor(TouchSensor, {
  //       activationConstraint: {
  //           delay: 250,
  //           tolerance: 5,
  //       },
  //   }),
  //   useSensor(KeyboardSensor, {
  //     coordinateGetter: sortableKeyboardCoordinates,
  //   })
  // );

  // function findColumn(id: string | number) {
  //   if (!id) return null;
  //   if (columns.find(c => c.id === id)) {
  //       return columns.find(c => c.id === id);
  //   }
  //   return columns.find(c => c.tasks.some(t => t.id === id));
  // }

  // function handleDragStart(event: DragStartEvent) {
  //   const { active } = event;
  //   const task = columns.flatMap(c => c.tasks).find(t => t.id === active.id);
  //   if (task) setActiveTask(task);
  // }

  // function handleDragOver(event: DragOverEvent) {
  //   const { active, over } = event;
  //   if (!over) return;

  //   const activeId = active.id;
  //   const overId = over.id;

  //   // Find the containers
  //   const activeColumn = findColumn(activeId);
  //   const overColumn = findColumn(overId);

  //   if (!activeColumn || !overColumn || activeColumn === overColumn) {
  //     return;
  //   }

  //   setColumns((prev) => {
  //     const activeItems = activeColumn.tasks;
  //     const overItems = overColumn.tasks;
  //     const activeIndex = activeItems.findIndex((t) => t.id === activeId);
  //     const overIndex = overItems.findIndex((t) => t.id === overId);

  //     let newIndex;
  //     if (overItems.some(t => t.id === overId)) {
  //       newIndex = overItems.length + 1;
  //     } else {
  //       const isBelowOverItem =
  //         over &&
  //         active.rect.current.translated &&
  //         active.rect.current.translated.top >
  //           over.rect.top + over.rect.height;

  //       const modifier = isBelowOverItem ? 1 : 0;
  //       newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
  //     }

  //     return prev.map((c) => {
  //       if (c.id === activeColumn.id) {
  //         return {
  //           ...c,
  //           tasks: activeItems.filter((t) => t.id !== activeId),
  //         };
  //       } else if (c.id === overColumn.id) {
  //         const newTasks = [
  //           ...overItems.slice(0, newIndex),
  //           activeItems[activeIndex],
  //           ...overItems.slice(newIndex, overItems.length),
  //         ];
  //         return {
  //           ...c,
  //           tasks: newTasks,
  //         };
  //       } else {
  //         return c;
  //       }
  //     });
  //   });
  // }

  // function handleDragEnd(event: DragEndEvent) {
  //   const { active, over } = event;
  //   const activeId = active.id;
  //   const overId = over?.id;

  //   if (!overId) {
  //       setActiveTask(null);
  //       return;
  //   }

  //   const activeColumn = findColumn(activeId);
  //   const overColumn = findColumn(overId);

  //   if (activeColumn && overColumn) {
  //     const activeIndex = activeColumn.tasks.findIndex((t) => t.id === activeId);
  //     const overIndex = overColumn.tasks.findIndex((t) => t.id === overId);

  //     if (activeColumn.id !== overColumn.id) {
  //         // Already handled in DragOver
  //     } else {
  //         // Same column reorder
  //         if (activeIndex !== overIndex) {
  //           setColumns((prev) => {
  //               const newColumns = prev.map(col => {
  //                   if (col.id === activeColumn.id) {
  //                       return {
  //                           ...col,
  //                           tasks: arrayMove(col.tasks, activeIndex, overIndex)
  //                       }
  //                   }
  //                   return col;
  //               });
  //               return newColumns;
  //           });
  //         }
  //     }
      
  //     const finalColumn = columns.find(c => c.tasks.some(t => t.id === activeId));
  //     if (finalColumn) {
  //         const tasks = finalColumn.tasks;
  //         const index = tasks.findIndex(t => t.id === activeId);
          
  //         // Calculate order
  //         const prevTask = tasks[index - 1];
  //         const nextTask = tasks[index + 1];
          
  //         let newOrder = 0;
  //         if (!prevTask && !nextTask) {
  //             newOrder = 1000;
  //         } else if (!prevTask) {
  //             newOrder = nextTask.order / 2;
  //         } else if (!nextTask) {
  //             newOrder = prevTask.order + 1000;
  //         } else {
  //             newOrder = (prevTask.order + nextTask.order) / 2;
  //         }
          
  //         updateTaskPosition(activeId as string, finalColumn.id, newOrder);
  //     }
  //   }

  //   setActiveTask(null);
  // }

  return (
    <DragDropProvider>
        <div className='flex-1 flex flex-col md:flex-row gap-6 pb-4 h-full md:overflow-x-auto' >
        {columns.map((column) => (
            <Column key={column.id} column={column} />
            ))}
        </div>
        <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
    </DragDropProvider>
  )
}

export default Columns