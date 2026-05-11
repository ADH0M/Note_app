import { useDispatchHook } from "@/hooks/useSelector";
import { userProjects } from "@/store/reducers/project";
import React, { useCallback } from "react";
import { toast } from "sonner";

type StateConfirm = string | null;
type PropTypes = {
  editingId: StateConfirm;
  editTitle: string;
  setEditTitle: React.Dispatch<React.SetStateAction<string>>;
  setEditingId: React.Dispatch<React.SetStateAction<StateConfirm>>;
  userId: string;
};

const OnEdit = ({
  editingId,
  editTitle,
  setEditTitle,
  setEditingId,
  userId,
}: PropTypes) => {
  const dispatch = useDispatchHook();
  const handleEdit = useCallback(async <T,>(userId: T, id: T, title: T) => {
    if (!userId || !id || !title) return;
    const res = await fetch(`/api/projects/project/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ userId, title }),
    });

    if (res.ok) {
      toast.success("Update project title successful");
    } else {
      toast.error("faild to update project");
    }
  }, []);

  return (
    <div>
      {/* Edit Modal */}
      {editingId && userId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Edit Project</h3>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-2 border border-border rounded-lg bg-background mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingId(null)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleEdit(userId, editingId, editTitle);
                  if (userId) {
                    dispatch(userProjects(userId));
                  }

                  setEditingId(null);
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnEdit;
