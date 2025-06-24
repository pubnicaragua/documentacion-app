import { StyleSheet, View, Text } from "react-native"

interface PersonalInfoSectionProps {
  id: string
  fullName: string
  nickname: string
  nationality: string
  age: string
  school: string
  phone: string
  father: string
  mother: string
}

const PersonalInfoSection = ({
  id,
  fullName,
  nickname,
  nationality,
  age,
  school,
  phone,
  father,
  mother,
}: PersonalInfoSectionProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Datos personales</Text>
        <Text style={styles.idText}>ID: {id}</Text>
      </View>

      {/* Grupo de datos personales */}
      <View style={styles.dataGroup}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nombre:</Text>
          <Text style={styles.infoValue}>{fullName}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nombre social:</Text>
          <Text style={styles.infoValue}>{nickname}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nacionalidad:</Text>
          <Text style={styles.infoValue}>{nationality}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Edad:</Text>
          <Text style={styles.infoValue}>{age}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Colegio:</Text>
          <Text style={styles.infoValue}>{school}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Celular:</Text>
          <Text style={styles.infoValue}>{phone}</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, styles.secondSectionTitle]}>Datos familiares</Text>

      {/* Grupo de datos familiares */}
      <View style={styles.dataGroup}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Padre:</Text>
          <Text style={styles.infoValue}>{father}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Madre:</Text>
          <Text style={styles.infoValue}>{mother}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  secondSectionTitle: {
    marginTop: 20,
    marginBottom: 15,
  },
  idText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dataGroup: {
    borderWidth: 0.5,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    padding: 15,
    backgroundColor: "#FFFFFF",
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  separator: {
    height: 0.5,
    backgroundColor: "#EEEEEE",
    marginVertical: 2,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: 150,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
})

export default PersonalInfoSection
