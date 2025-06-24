import { StyleSheet, Text, View, FlatList, Dimensions } from "react-native"
import TaskCard from "./TaskCard"
import type { Task } from "../../types/types"

const { width: screenWidth } = Dimensions.get("window")
const CARD_WIDTH = 200
const CARD_MARGIN = 15

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
        snapToAlignment="start"
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
        pagingEnabled={false}
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  listContent: {
    paddingRight: 20,
  },
})

export default TaskList
