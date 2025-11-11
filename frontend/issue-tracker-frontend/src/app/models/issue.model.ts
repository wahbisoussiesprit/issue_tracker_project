export interface Issue {
  id?: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  projectId: number;
  assignedTo: number;
  dueDate?: string;  // ISO yyyy-MM-dd
  tags?: string;     // comma-separated
  createdAt?: string;
  updatedAt?: string;
}
