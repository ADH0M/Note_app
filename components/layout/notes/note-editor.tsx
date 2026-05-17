/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUpdateNoteMutation } from "@/store/reduxApi/notes.api";

import { CalendarDaysIcon, PlusIcon, XIcon } from "lucide-react";

import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "sonner";

interface Props {
  note: any;
  editMode: boolean;
  setEditMode:Dispatch<SetStateAction<boolean>>
}

export function NoteEditor({ note, editMode ,setEditMode}: Props) {
  const [updateNote] = useUpdateNoteMutation();

  const [tagInput, setTagInput] = useState("");

  const [attendeeInput, setAttendeeInput] = useState("");

  const [actionInput, setActionInput] = useState("");

  const [form, setForm] = useState({
    title: note.title,
    content: note.content,
    meetingDate: note.meetingDate?.split("T")[0] || "",

    attendees: note.attendees || [],

    actionItems: note.actionItems || [],

    tags: note.tags || [],
  });

  async function handleSave() {
    const up = await updateNote({
      id: note.id,
      ...form,
    });

    if (up.data) {
      toast.success("update note is successful");
      setEditMode(false);

    } else if (up.error) {
      toast.success("Faild to update note ");
    }
  }

  function addTag() {
    if (!tagInput.trim()) return;

    setForm((prev) => ({
      ...prev,
      tags: [...prev.tags, tagInput],
    }));

    setTagInput("");
  }

  function removeTag(tag: string) {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t: string) => t !== tag),
    }));
  }

  function addAttendee() {
    if (!attendeeInput.trim()) return;

    setForm((prev) => ({
      ...prev,
      attendees: [...prev.attendees, attendeeInput],
    }));

    setAttendeeInput("");
  }

  function removeAttendee(name: string) {
    setForm((prev) => ({
      ...prev,
      attendees: prev.attendees.filter((a: string) => a !== name),
    }));
  }

  function addActionItem() {
    if (!actionInput.trim()) return;

    setForm((prev) => ({
      ...prev,
      actionItems: [...prev.actionItems, actionInput],
    }));

    setActionInput("");
  }

  function removeActionItem(item: string) {
    setForm((prev) => ({
      ...prev,
      actionItems: prev.actionItems.filter((a: string) => a !== item),
    }));
  }

  return (
    <div className="space-y-2  ">
      {/* title */}
      <input
        disabled={!editMode}
        value={form.title}
        onChange={(e) =>
          setForm({
            ...form,
            title: e.target.value,
          })
        }
        className={` w-full rounded-xl border px-3 py-2 text-2xl font-bold text-foreground 
          outline-none transition-colors disabled:opacity-80
        ${
          editMode
            ? "border-border bg-background"
            : "border-transparent bg-transparent"
        }
        `}
      />

      {/* content */}
      <textarea
        disabled={!editMode}
        value={form.content}
        onChange={(e) =>
          setForm({
            ...form,
            content: e.target.value,
          })
        }
        rows={6}
        className="
        min-h-[300px] w-full resize-none rounded-2xl border border-border bg-background p-4 text-sm leading-7 
        text-foreground outline-none transition-colors disabled:opacity-80
        "
      />

      {/* meeting date */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="size-4 text-accent-foreground" />

          <h3 className="text-sm font-medium text-accent-foreground">
            Meeting Date
          </h3>
        </div>

        <input
          type="date"
          disabled={!editMode}
          value={form.meetingDate}
          onChange={(e) =>
            setForm({
              ...form,
              meetingDate: e.target.value,
            })
          }
          className="
          h-11
          w-full
          rounded-xl
          border
          border-input
          bg-background
          px-4
          text-sm
          text-foreground
          outline-none
          "
        />
      </div>

      {/* attendees */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-accent-foreground">
          Attendees
        </h3>

        <div className="flex flex-wrap gap-2">
          {form.attendees.map((attendee: string) => (
            <div
              key={attendee}
              className="
                flex  items-center  gap-2  rounded-full  bg-accent  px-3  py-1.5  
                text-sm  text-accent-foreground
                "
            >
              <span>{attendee}</span>

              {editMode && (
                <button onClick={() => removeAttendee(attendee)}>
                  <XIcon className="size-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {editMode && (
          <div className="flex gap-2">
            <input
              value={attendeeInput}
              onChange={(e) => setAttendeeInput(e.target.value)}
              placeholder="Add attendee"
              className="
              h-11
              flex-1
              rounded-xl
              border
              border-input
              bg-background
              px-4
              text-sm
              text-foreground
              outline-none
              "
            />

            <button
              onClick={addAttendee}
              type="button"
              className="
              flex
              size-11
              items-center
              justify-center
              rounded-xl
              bg-primary
              text-primary-foreground
              "
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* action items */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-accent-foreground">
          Action Items
        </h3>

        <div className="space-y-2">
          {form.actionItems.map((item: string) => (
            <div
              key={item}
              className=" flex items-center justify-between rounded-xl border
               border-border bg-background px-4 py-3
                "
            >
              <p className="text-sm text-foreground">{item}</p>

              {editMode && (
                <button onClick={() => removeActionItem(item)}>
                  <XIcon className="size-4 text-muted-foreground" />
                </button>
              )}
            </div>
          ))}
        </div>

        {editMode && (
          <div className="flex gap-2">
            <input
              value={actionInput}
              onChange={(e) => setActionInput(e.target.value)}
              placeholder="Add action item"
              className="
              h-11
              flex-1
              rounded-xl
              border
              border-input
              bg-background
              px-4
              text-sm
              text-foreground
              outline-none
              "
            />

            <button
              type="button"
              onClick={addActionItem}
              className="
              flex
              size-11
              items-center
              justify-center
              rounded-xl
              bg-primary
              text-primary-foreground
              "
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* tags */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-accent-foreground">Tags</h3>

        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag: string) => (
            <div
              key={tag}
              className="
              flex
              items-center
              gap-2
              rounded-full
              bg-secondary
              px-3
              py-1.5
              text-sm
              text-secondary-foreground
              "
            >
              <span>#{tag}</span>

              {editMode && (
                <button onClick={() => removeTag(tag)}>
                  <XIcon className="size-3" />
                </button>
              )}
            </div>
          ))}
        </div>

        {editMode && (
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tag"
              className="
              h-11
              flex-1
              rounded-xl
              border
              border-input
              bg-background
              px-4
              text-sm
              text-foreground
              outline-none
              "
            />

            <button
              type="button"
              onClick={addTag}
              className="
              flex
              size-11
              items-center
              justify-center
              rounded-xl
              bg-primary
              text-primary-foreground
              "
            >
              <PlusIcon className="size-4" />
            </button>
          </div>
        )}
      </div>

      {/* save */}
      <div className="flex justify-end pt-2">
        {editMode && (
          <button
            onClick={handleSave}
            className=" rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground 
            transition-colors hover:opacity-90
            "
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}
