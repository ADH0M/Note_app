export interface CreateNotePayload {
  title: string;
  content: string;
  projectId: string;
  userId:string;
  tags?: string[];
  attendees?: string[];
  meetingDate?: Date;
}

