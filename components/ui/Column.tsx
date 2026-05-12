'use client';
import { Prisma } from '@/generated/prisma'
import { deleteColumn } from '@/lib/actions/notes-action'
import Tasks from './Tasks'
import { useDroppable } from '@dnd-kit/react';

const Column = ({column}: {column: Prisma.ColumnGetPayload<{ include: { tasks: true } }>}) => {
    const { ref } = useDroppable({
        id: column.id,
        data: {
            type: "Column",
            column,
        }
    });

    return (
    <div 
        ref={ref}
        className="min-w-[300px] w-[300px] bg-card rounded-xl shadow-sm border border-border flex flex-col max-h-full">
     <div 
        className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
            <h3 className="font-semibold text-lg">{column.title}</h3>
            <form action={deleteColumn.bind(null, column.id)}>
                <button type="submit" className="text-muted-foreground hover:text-red-500 transition-colors" title="Delete Column">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
            </form>
        </div>
        <Tasks column={column} />
    </div>
    )
}

export default Column