import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./context/ThemeContext";

const H_PADDING = 20; // ต้องตรงกับ container.paddingHorizontal
const V_GAP = 14;     // ระยะห่างแนวตั้งระหว่างการ์ด

export default function Hub() {
  const { color } = useTheme();
  const { width: screenW } = useWindowDimensions();

  // จำกัดความกว้างสูงสุดของสแต็กให้ดูบาลานซ์บนจอใหญ่
  const stackWidth = Math.min(screenW - H_PADDING * 2, 560);

  return (
    <View style={{ flex: 1, backgroundColor: color.background }}>
      <ScrollView
        contentContainerStyle={[s.container, { backgroundColor: color.background }]}
      >
        <Text style={[s.header, { color: color.text }]}>Home</Text>
        <Text style={[s.subheader, { color: color.textSecondary }]}>
          เลือกเมนูเพื่อไปยังงานอื่น ๆ
        </Text>

        {/* สแต็กแนวตั้ง: การ์ดเต็มความกว้าง, เว้นระยะเท่ากัน */}
        <View style={[s.stack, { width: stackWidth }]}>
          {/* Profile */}
          <Link href="/profile" asChild>
            <TouchableOpacity
              style={[
                s.card,
                { backgroundColor: color.surface, borderColor: color.primary },
              ]}
              activeOpacity={0.85}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <View style={[s.iconWrap, { backgroundColor: `${color.primary}1A` }]}>
                <Ionicons name="person-circle-outline" size={36} color={color.primary} />
              </View>
              <View style={s.textWrap}>
                <Text style={[s.title, { color: color.text }]}>Profile</Text>
                <Text style={[s.subtitle, { color: color.textSecondary }]} numberOfLines={2}>
                  My Profile & Subject information
                </Text>
              </View>
            </TouchableOpacity>
          </Link>

          {/* Books */}
          <Link href="/book" asChild>
            <TouchableOpacity
              style={[
                s.card,
                { backgroundColor: color.surface, borderColor: color.primary },
              ]}
              activeOpacity={0.85}
              hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            >
              <View style={[s.iconWrap, { backgroundColor: `${color.primary}1A` }]}>
                <Ionicons name="book-outline" size={36} color={color.primary} />
              </View>
              <View style={s.textWrap}>
                <Text style={[s.title, { color: color.text }]}>Books</Text>
                <Text style={[s.subtitle, { color: color.textSecondary }]} numberOfLines={2}>
                  Book CRUD
                </Text>
                <Text style={[s.subtitle, { color:"#d32f2f" }]} numberOfLines={3}>
                  **ก่อนเข้าใช้งาน ต้องเปลี่ยน BASE_URL ในไฟล์ app/config/api.js ให้ตรงกับ IP ของเครื่องของท่านและเปิด API ใน Docker ก่อนใช้งาน**
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: H_PADDING,
  },
  header: { fontSize: 32, fontWeight: "800", letterSpacing: 0.3 },
  subheader: { fontSize: 16, marginTop: 6, marginBottom: 12 },

  // สแต็กแนวตั้ง ให้สมมาตรด้วยระยะ V_GAP คงที่ และกึ่งกลางจอ
  stack: {
    alignSelf: "center",
    // ถ้า RN เวอร์ชันคุณรองรับ gap:
    gap: V_GAP,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    // เงา
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
    // เผื่อ RN ไม่รองรับ gap:
    marginBottom: V_GAP,
    minHeight: 110,
  },

  iconWrap: {
    width: 58,
    height: 58,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  textWrap: { flex: 1, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "800", lineHeight: 24 },
  subtitle: { fontSize: 14, marginTop: 6, lineHeight: 18 },
});
