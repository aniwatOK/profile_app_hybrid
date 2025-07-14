import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";
const ThemeToggle = () => {
  const { color, toggleTheme } = useTheme();
  return (
    <TouchableOpacity onPress={toggleTheme} style={{ paddingHorizontal: 16, paddingVertical: 6 }}>
      <Text style={{ color: color.text, fontSize: 16, fontWeight: "bold" }}>เปลี่ยนธีม</Text>
    </TouchableOpacity>
  );
};
export default ThemeToggle;
