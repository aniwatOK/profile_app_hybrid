import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTheme } from "./context/ThemeContext";
import { Link } from "expo-router";

const courseData = {
  name: "Hybrid Mobile Application Programming",
  code: "IN405109",
  instructor: "Aj. Tanapattara Wongkhamchan",
  description:
    "สถาปัตยกรรมฮาร์ดแวร์ คุณลักษณะและข้อจํากัดของอุปกรณ์เคลื่อนที่ เครื่องมือและภาษาที่ใช้สําหรับพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่หลากหลายแพลตฟอร์ม การพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่โดยใช้ภาษาหลากหลายแพลตฟอร์ม กระบวนการพัฒนาโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่หลากหลายแพลตฟอร์ม การใช้หน่วยความจําและส่วนเก็บบันทึกข้อมูล การขออนุญาตและการเข้าถึงส่วนฮาร์ดแวร์ ส่วนติดต่อกับผู้ใช้ การสื่อสารเครือข่ายกับภายนอก การเชื่อมโยงกับระบบเครืองแม่ข่าย การทดสอบโปรแกรมประยุกต์บนอุปกรณ์เคลื่อนที่โดยใช้ระบบคอมพิวเตอร์ ประเด็นด้านความมั่นคง การฝึกปฏิบัติ"
};

export default function About() {
  const { color } = useTheme();
  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: color.background }]}> 
      <View style={[styles.card, { backgroundColor: color.surface, shadowColor: color.textSecondary }]}> 
        <Text style={[styles.title, { color: color.primary }]}>รายละเอียดรายวิชา</Text>
        <View style={[styles.infoBox, { backgroundColor: color.background, borderColor: color.primary }]}> 
          <Text style={[styles.label, { color: color.text }]}>ชื่อวิชา:</Text>
          <Text style={[styles.value, { color: color.text }]}>{courseData.name}</Text>
          <Text style={[styles.label, { color: color.text }]}>รหัสวิชา:</Text>
          <Text style={[styles.value, { color: color.text }]}>{courseData.code}</Text>
          <Text style={[styles.label, { color: color.text }]}>อาจารย์ผู้สอน:</Text>
          <Text style={[styles.value, { color: color.text }]}>{courseData.instructor}</Text>
        </View>
        <View style={[styles.descBox, { backgroundColor: color.background, borderColor: color.primary }]}> 
          <Text style={[styles.label, { color: color.primary, marginBottom: 8 }]}>รายละเอียด:</Text>
          <Text style={[styles.description, { color: color.text }]}>{courseData.description}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: 380,
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
    letterSpacing: 1,
  },
  infoBox: {
    width: "100%",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1.2,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 2,
  },
  descBox: {
    width: "100%",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.2,
    marginTop: 4,
  },
  description: {
    fontSize: 15,
    textAlign: "left",
    lineHeight: 24,
    marginTop: 0,
  },
  profileButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  profileButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
