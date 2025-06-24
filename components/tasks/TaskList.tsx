import { StyleSheet, View, Text } from "react-native"
import TaskItem from "./TaskItem"

interface Task {
  id: number
  subject: string
  description: string
  dueDate: string
  color: string
}

interface TaskListProps {
  month: string
  tasks: Task[]
}

const TaskList = ({ month, tasks }: TaskListProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.monthTitle}>{month}</Text>
      {tasks.length > 0 ? (
        tasks.map((task) => <TaskItem key={task.id} task={task} />)
      ) : (
        <Text style={styles.emptyText}>No hay tareas para este mes</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
  },
})

export default TaskList
