import { StyleSheet, Text, View, FlatList } from "react-native"
import TaskCard from "./TaskCard"
import type { Task } from "../types/types"

interface TaskListProps {
  title: string
  tasks: Task[]
}

const TaskList = ({ title, tasks }: TaskListProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={tasks}
        renderItem={({ item }) => <TaskCard task={item} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  listContent: {
    paddingRight: 20,
  },
})

export default TaskList
