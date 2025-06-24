import { StyleSheet, View, TouchableOpacity, Text } from "react-native"

interface TaskTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const TaskTabs = ({ activeTab, onTabChange }: TaskTabsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "Tareas" && styles.activeTab]}
        onPress={() => onTabChange("Tareas")}
      >
        <Text style={[styles.tabText, activeTab === "Tareas" && styles.activeTabText]}>Tareas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === "Examenes" && styles.activeTab]}
        onPress={() => onTabChange("Examenes")}
      >
        <Text style={[styles.tabText, activeTab === "Examenes" && styles.activeTabText]}>Exámenes</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 50,
    // marginBottom: 20,
    marginVertical: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#64B5F6",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#2196F3",
  },
  tabText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  activeTabText: {
    color: "white",
  },
})

export default TaskTabs
