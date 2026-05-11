import React from "react";

type StateConfirm = string | null;
type PropTypes = {
  deleteConfirm: StateConfirm;
  setDeleteConfirm: React.Dispatch<React.SetStateAction<StateConfirm>>;
  handleDelete:(state:string)=>void;
};
const OnDelete = ({ deleteConfirm, setDeleteConfirm, handleDelete }: PropTypes) => {
  return (
    <div>
      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Delete Project</h3>
            <p className="text-muted-foreground mb-4">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnDelete;
