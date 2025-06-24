export interface Task {
  id: number
  subject: string
  description: string
  daysLeft: number
  dueDate?:string
  color: string
}
