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

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Nombre:</Text>
        <Text style={styles.infoValue}>{fullName}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Nonbre Social:</Text>
        <Text style={styles.infoValue}>{nickname}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Nacionalidad:</Text>
        <Text style={styles.infoValue}>{nationality}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Edad:</Text>
        <Text style={styles.infoValue}>{age}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Colegio:</Text>
        <Text style={styles.infoValue}>{school}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Celular:</Text>
        <Text style={styles.infoValue}>{phone}</Text>
      </View>

      <Text style={[styles.sectionTitle, styles.secondSectionTitle]}>Datos personales</Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Apoderado Principal:</Text>
        <Text style={styles.infoValue}>{father}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Apoderado Secundario:</Text>
        <Text style={styles.infoValue}>{mother}</Text>
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
  infoRow: {
    flexDirection: "row",
    marginBottom: 10,
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
