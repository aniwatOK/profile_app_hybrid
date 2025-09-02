import { StyleSheet, Image, Text, View, ScrollView } from "react-native";
import { Link } from "expo-router";
import { useTheme } from "./context/ThemeContext";


const profileData = {
  name: "Aniwat Na Nongkhai",
  image: require("../assets/profile.png"),
  id: "653450106-7",
  major: "Computer Science",
  program: "Bachelor of Science",
  university: "Khon Kaen University",
  skills: ["Python", "JavaScript", "UI/UX Design","Gitlab CI/CD","Ubuntu Server"]
};

export default function Profile() {
  const { color } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: color.background }]}> 
        <View style={[styles.card, { backgroundColor: color.surface, shadowColor: color.textSecondary }]}> 
          <Image
            source={profileData.image}
            style={[styles.profileImage, { borderColor: color.primary, backgroundColor: color.surface }]}
          />
          <Text style={[styles.name, { color: color.text }]}>{profileData.name}</Text>
          <Text style={[styles.university, { color: color.textSecondary }]}>{profileData.university}</Text>
          <View style={[styles.infoBox, { backgroundColor: color.background, borderColor: color.primary }]}> 
            <Text style={[styles.info, { color: color.text }]}><Text style={[styles.label, { color: color.primary }]}>รหัสนักศึกษา:</Text> {profileData.id}</Text>
            <Text style={[styles.info, { color: color.text }]}><Text style={[styles.label, { color: color.primary }]}>สาขา:</Text> {profileData.major}</Text>
            <Text style={[styles.info, { color: color.text }]}><Text style={[styles.label, { color: color.primary }]}>หลักสูตร:</Text> {profileData.program}</Text>
          </View>
          <View style={[styles.skillsBox, { backgroundColor: color.background, borderColor: color.primary }]}> 
            <Text style={[styles.label, { color: color.primary }]}>ความสามารถ/สกิลอื่น ๆ:</Text>
            {profileData.skills.map((skill, idx) => (
              <Text key={idx} style={[styles.skillItem, { color: color.text }]}>{`• ${skill}`}</Text>
            ))}
          </View>
        </View>
        <Link href="/about" style={[styles.aboutButton, { backgroundColor: color.primary, shadowColor: color.textSecondary }]}> 
          <Text style={[styles.aboutButtonText, { color: color.background }]}>About</Text>
        </Link>
        <Link href="/book" style={[styles.aboutButton, { backgroundColor: color.primary, shadowColor: color.textSecondary }]}> 
          <Text style={[styles.aboutButtonText, { color: color.background }]}>Book</Text>
        </Link>
        <Link href="/signin" style={[styles.aboutButton, { backgroundColor: color.primary, shadowColor: color.textSecondary }]}> 
          <Text style={[styles.aboutButtonText, { color: color.background }]}>SignIn</Text>
        </Link>
        <Link href="/signup" style={[styles.aboutButton, { backgroundColor: color.primary, shadowColor: color.textSecondary }]}> 
          <Text style={[styles.aboutButtonText, { color: color.background }]}>SignUp</Text>
        </Link>
      </ScrollView>
    </View>
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
    width: 340,
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  university: {
    fontSize: 16,
    marginBottom: 18,
  },
  infoBox: {
    width: "100%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1.5,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
  },
  skillsBox: {
    width: "100%",
    borderRadius: 12,
    padding: 16,
    marginTop: 4,
    borderWidth: 1.5,
  },
  skillItem: {
    fontSize: 15,
    marginTop: 6,
    marginLeft: 8,
  },
  aboutButton: {
    marginVertical: 10, // เพิ่มระยะห่างบน-ล่างแต่ละปุ่ม
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
  aboutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
