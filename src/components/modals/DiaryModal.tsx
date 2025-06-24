"use client";
import { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
  Platform,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_ENDPOINTS, fetchAuthApi } from "config/api";
import { useProfile } from "context/ProfileContext";
import { useAuth } from "context/AuthContext";

const { height: screenHeight } = Dimensions.get("window");

interface DiaryModalProps {
  visible: boolean;
  onClose: () => void;
  date: string;
  title: string;
  description: string;
  diario_id: number;
  onDelete: (id: number) => void;
}
const DiaryModal = ({
  visible,
  onClose,
  date,
  title,
  description,
  diario_id,
  onDelete,
}: DiaryModalProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
      const {agregarDiario} = useProfile()
  const {user} = useAuth()
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);
  const handleEditPress = () => {
    setIsEditing(true);
    setEditTitle(title);
    setEditDescription(description);
  };

  const handleSave = async () => {
    try {
       await fetchAuthApi(
       API_ENDPOINTS.DIARIO +'/'+
          diario_id,
        {
          method: "PUT",
          body: JSON.stringify({
            titulo: editTitle,
            descripcion: editDescription,
            alumno_id:user?.alumno_id,
            fecha: convertSpanishDateToISO(date)
          }),
        }
      );
      title = editTitle
      description= editDescription
      setIsEditing(false);
      agregarDiario(true);
    } catch (error) {
      console.error("Error saving diary:", error);
    }
  };
const convertSpanishDateToISO = (spanishDate: string): string => {  
  const monthMap: { [key: string]: string } = {  
    'enero': '01',  
    'febrero': '02',  
    'marzo': '03',  
    'abril': '04',  
    'mayo': '05',  
    'junio': '06',  
    'julio': '07',  
    'agosto': '08',  
    'septiembre': '09',  
    'octubre': '10',  
    'noviembre': '11',  
    'diciembre': '12'  
  }  
  
  // Extraer día y mes del string "16 de junio"  
  const parts = spanishDate.toLowerCase().split(' de ')  
  const day = parts[0].padStart(2, '0')  
  const monthName = parts[1]  
  const month = monthMap[monthName]  
    
  // Usar el año actual por defecto  
  const currentYear = new Date().getFullYear()  
    
  return `${currentYear}-${month}-${day}`  
}  
  const handleCancel = () => {
    setIsEditing(false);
    setEditTitle(title);
    setEditDescription(description);
  };
  return (
    <Modal visible={visible} transparent animationType="none">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.header}>
                <Text style={styles.title}>Diario</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={18} color="black" />
                </TouchableOpacity>
              </View>

              <View style={styles.mascotContainer}>
                <Image
                  source={require("../../../assets/almis/AlmieDiario.png")}
                  style={styles.mascotImage}
                />
                <Text style={styles.dateText}>{date}</Text>
              </View>

              <View style={styles.waveContainer}>
                <View style={styles.wave} />
              </View>

              <ScrollView
                style={styles.contentContainer}
                contentContainerStyle={styles.contentScroll}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.diarySection}>  
  {!isEditing ? (  
    <>  
      <View style={styles.titleRow}>  
        <Text style={styles.sectionTitle}>{title}</Text>  
        <View style={styles.actionsContainer}>   
          <TouchableOpacity onPress={handleEditPress} style={styles.actionButton}>        
            <Ionicons name="pencil" size={16} color="#1976D2" />        
          </TouchableOpacity>    
          <TouchableOpacity onPress={() => onDelete(diario_id)} style={styles.actionButton}>        
            <Ionicons name="close" size={16} color="#D32F2F" />        
          </TouchableOpacity>       
        </View>  
      </View>  
      <Text style={styles.diaryText}>{description}</Text>  
    </>  
  ) : (  
    <>  
      <TextInput  
        style={styles.titleInput}  
        value={editTitle}  
        onChangeText={setEditTitle}  
        placeholder="Título del diario"  
        multiline={false}  
      />  
      <TextInput  
        style={styles.descriptionInput}  
        value={editDescription}  
        onChangeText={setEditDescription}  
        placeholder="Descripción del diario"  
        multiline={true}  
        numberOfLines={6}  
      />  
      <View style={styles.editActions}>  
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>  
          <Text style={styles.cancelButtonText}>Cancelar</Text>  
        </TouchableOpacity>  
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>  
          <Text style={styles.saveButtonText}>Guardar</Text>  
        </TouchableOpacity>  
      </View>  
    </>  
  )}  
</View>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Los estilos se mantienen igual que en tu código original
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "android" ? 40 : 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    height:
      Platform.OS === "android"
        ? Math.min(screenHeight * 0.65, 500)
        : screenHeight * 0.7,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: "#A9D4FB",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  mascotContainer: {
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#A9D4FB",
  },
  mascotImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginTop: 4,
  },
  waveContainer: {
    height: 25,
    backgroundColor: "#A9D4FB",
    position: "relative",
  },
  wave: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 25,
    backgroundColor: "white",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  contentScroll: {
    padding: 14,
    paddingTop: 8,
    paddingBottom: 20,
  },
  diarySection: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  diaryText: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 2,
    marginRight: 10,
    marginLeft: 214,
  },
  actionButton: {
    padding: 4,
    marginHorizontal: 2,
  },
  titleRow: {  
  flexDirection: 'row',  
  justifyContent: 'space-between',  
  alignItems: 'center',  
  marginBottom: 6,  
},  
titleInput: {  
  borderWidth: 1,  
  borderColor: '#ddd',  
  borderRadius: 8,  
  padding: 12,  
  fontSize: 16,  
  fontWeight: 'bold',  
  marginBottom: 12,  
  backgroundColor: '#f9f9f9',  
},  
descriptionInput: {  
  borderWidth: 1,  
  borderColor: '#ddd',  
  borderRadius: 8,  
  padding: 12,  
  fontSize: 14,  
  minHeight: 120,  
  textAlignVertical: 'top',  
  backgroundColor: '#f9f9f9',  
  marginBottom: 16,  
},  
editActions: {  
  flexDirection: 'row',  
  justifyContent: 'space-between',  
  gap: 12,  
},  
cancelButton: {  
  flex: 1,  
  backgroundColor: '#f5f5f5',  
  padding: 12,  
  borderRadius: 8,  
  alignItems: 'center',  
},  
saveButton: {  
  flex: 1,  
  backgroundColor: '#1976D2',  
  padding: 12,  
  borderRadius: 8,  
  alignItems: 'center',  
},  
cancelButtonText: {  
  color: '#666',  
  fontWeight: 'bold',  
},  
saveButtonText: {  
  color: 'white',  
  fontWeight: 'bold',  
},
});

export default DiaryModal;
