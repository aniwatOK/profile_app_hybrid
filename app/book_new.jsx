// app/book_new.jsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  Button,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

const BookNew = () => {
  // ฟิลด์สำหรับสร้างหนังสือ
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("2024");
  const [price, setPrice] = useState("0");
  const [available, setAvailable] = useState(true);

  // ช่องหลังบ้าน: วาง JWT ชั่วคราวเพื่อทดสอบ (จะถูกแนบใน Authorization header)
  const [token, setToken] = useState("IAMTESTER");

  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!title.trim()) return "กรุณากรอก Title";
    if (!author.trim()) return "กรุณากรอก Author";
    if (!genre.trim()) return "กรุณากรอก Genre";
    const y = parseInt(year, 10);
    if (Number.isNaN(y) || y < 0) return "Year ไม่ถูกต้อง";
    const p = parseFloat(price);
    if (Number.isNaN(p) || p < 0) return "Price ไม่ถูกต้อง";
    return "";
  };

  const handleCreate = async () => {
    const msg = validate();
    if (msg) {
      Alert.alert("ข้อมูลไม่ครบ", msg);
      return;
    }

    const bookData = {
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      genre: genre.trim(),
      year: parseInt(year, 10),
      price: parseFloat(price),
      available,
    };

    try {
      setLoading(true);

      const res = await fetch("http://10.26.137.44:3000/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token.trim() ? { Authorization: `Bearer ${token.trim()}` } : {}),
        },
        body: JSON.stringify(bookData),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json?.message || `สร้างไม่สำเร็จ (status ${res.status})`);
      }

      const created = json?.book ?? json; // เผื่อ API ส่งเป็น {book: {...}} หรือ {...} ตรง ๆ
      Alert.alert("สำเร็จ", "สร้างหนังสือเรียบร้อย", [
        {
          text: "OK",
          onPress: () => {
            if (created?._id) {
              router.replace(`/book_detail?id=${created._id}`);
            } else {
              router.back();
            }
          },
        },
      ]);
    } catch (e) {
      Alert.alert("Error", String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={style.container}>
      <Text style={style.header}>Create a New Book</Text>

      <Text style={style.label}>Title *</Text>
      <TextInput
        style={style.input}
        placeholder="เช่น The Great Gatsby"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={style.label}>Author *</Text>
      <TextInput
        style={style.input}
        placeholder="เช่น F. Scott Fitzgerald"
        value={author}
        onChangeText={setAuthor}
      />

      <Text style={style.label}>Description</Text>
      <TextInput
        style={[style.input, { height: 90 }]}
        placeholder="คำอธิบายหนังสือ"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={style.label}>Genre *</Text>
      <TextInput
        style={style.input}
        placeholder="เช่น Classic / Dystopian"
        value={genre}
        onChangeText={setGenre}
      />

      <Text style={style.label}>Year *</Text>
      <TextInput
        style={style.input}
        placeholder="2024"
        value={year}
        onChangeText={setYear}
        keyboardType="number-pad"
      />

      <Text style={style.label}>Price *</Text>
      <TextInput
        style={style.input}
        placeholder="9.99"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />

      <View style={style.row}>
        <Text style={style.label}>Available</Text>
        <Switch value={available} onValueChange={setAvailable} />
      </View>

      <View style={{ height: 12 }} />

      {loading ? (
        <View style={style.center}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 8 }}>กำลังบันทึก…</Text>
        </View>
      ) : (
        <Button title="Create" onPress={handleCreate} />
      )}
    </ScrollView>
  );
};

export default BookNew;

const style = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 10,
  },
  header: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  label: { fontSize: 14, opacity: 0.8 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  center: { alignItems: "center", justifyContent: "center" },
});
