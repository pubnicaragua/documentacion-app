import { View, Text, StyleSheet, TouchableOpacity } from "react-native"

interface TaskTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const TaskTabs = ({ activeTab = "Tareas", onTabChange }: TaskTabsProps) => {
  const tabs = ["Tareas", "Exámenes", "Proyectos"]

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[styles.tab, activeTab === tab && styles.activeTab]}
          onPress={() => onTabChange(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 25,
    margin: 15,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#2196F3",
  },
  tabText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "white",
  },
})

export default TaskTabs
