import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const API_ROOT = "http://10.26.137.44:3000";

export default function BookDetail() {
  const { id } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    year: "0",
    price: "0",
    available: true,
  });

  const load = async () => {
    if (!id) return;
    try {
      setError("");
      setLoading(true);
      const res = await fetch(`${API_ROOT}/api/books/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `(${res.status})`);
      const b = json?.book ?? json;
      setBook(b);
      setForm({
        title: b.title ?? "",
        author: b.author ?? "",
        description: b.description ?? "",
        genre: b.genre ?? "",
        year: String(b.year ?? ""),
        price: String(b.price ?? ""),
        available: !!b.available,
      });
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const body = {
        title: form.title.trim(),
        author: form.author.trim(),
        description: form.description.trim(),
        genre: form.genre.trim(),
        year: parseInt(form.year, 10),
        price: parseFloat(form.price),
        available: !!form.available,
      };
      const res = await fetch(`${API_ROOT}/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.message || `(${res.status})`);
      setIsEditing(false);
      await load();
    } catch (e) {
      Alert.alert("บันทึกไม่สำเร็จ", String(e));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert("ยืนยันการลบ", "คุณต้องการลบหนังสือเล่มนี้ใช่ไหม?", [
      { text: "ยกเลิก", style: "cancel" },
      { text: "ลบ", style: "destructive", onPress: handleDelete },
    ]);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await fetch(`${API_ROOT}/api/books/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.message || `(${res.status})`);
      }
      Alert.alert("ลบแล้ว", "ลบหนังสือเรียบร้อย", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("ลบไม่สำเร็จ", String(e));
    } finally {
      setDeleting(false);
    }
  };

  const StatusPill = ({ ok }) => (
    <Text style={[styles.badgeStatus, ok ? styles.badgeOk : styles.badgeNo]}>
      {ok ? "Available" : "Unavailable"}
    </Text>
  );

  if (loading) {
    return (
      <View style={[styles.screen, styles.center]}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>กำลังโหลดข้อมูล…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={{ color: "red", textAlign: "center" }}>
          โหลดไม่สำเร็จ{"\n"}{error}
        </Text>
        <TouchableOpacity style={[styles.primaryBtn, { marginTop: 10 }]} onPress={load}>
          <Text style={styles.primaryBtnText}>ลองใหม่</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!book) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text>ไม่พบข้อมูลหนังสือ</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      {/* Top Bar */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={22} />
        </TouchableOpacity>
        <Text style={styles.header} numberOfLines={1}>รายละเอียดหนังสือ</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Card */}
      <View style={styles.card}>
        {/* Title + Author + Status */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.author}>{book.author}</Text>
          </View>
          <StatusPill ok={!!book.available} />
        </View>

        {!!book.description && (
          <Text style={styles.desc}>{book.description}</Text>
        )}

        {/* Meta */}
        <View style={styles.metaRow}>
          {!!book.genre && <Text style={styles.badge}>{book.genre}</Text>}
          {!!book.year && <Text style={styles.badgeMuted}>{book.year}</Text>}
          {typeof book.price !== "undefined" && book.price !== null && (
            <Text style={styles.price}>฿{Number(book.price).toFixed(2)}</Text>
          )}
        </View>

        {/* Added by */}
        {!!book.addedBy && (
          <Text style={styles.addedBy}>
            เพิ่มโดย: {book.addedBy.username ?? book.addedBy.email ?? "-"}
          </Text>
        )}
      </View>

      {/* Edit Form */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{isEditing ? "แก้ไขข้อมูล" : "ข้อมูลสำหรับแก้ไข"}</Text>
          {!isEditing ? (
            <TouchableOpacity style={styles.outlineBtn} onPress={() => setIsEditing(true)}>
              <Text style={styles.outlineBtnText}>แก้ไข</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => {
                  // ยกเลิก -> คืนค่าเดิม
                  setIsEditing(false);
                  setForm({
                    title: book.title ?? "",
                    author: book.author ?? "",
                    description: book.description ?? "",
                    genre: book.genre ?? "",
                    year: String(book.year ?? ""),
                    price: String(book.price ?? ""),
                    available: !!book.available,
                  });
                }}
                disabled={saving}
              >
                <Text style={styles.outlineBtnText}>ยกเลิก</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.primaryBtnText}>{saving ? "กำลังบันทึก…" : "บันทึก"}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Inputs */}
        <View style={styles.formGrid}>
          {[
            { key: "title", label: "Title", keyboard: "default" },
            { key: "author", label: "Author", keyboard: "default" },
            { key: "genre", label: "Genre", keyboard: "default" },
            { key: "year", label: "Year", keyboard: "number-pad" },
            { key: "price", label: "Price", keyboard: "decimal-pad" },
          ].map((f) => (
            <View key={f.key} style={styles.field}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input}
                value={form[f.key]}
                onChangeText={(t) => setForm((s) => ({ ...s, [f.key]: t }))}
                keyboardType={f.keyboard}
                editable={isEditing}
              />
            </View>
          ))}

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: "top" }]}
              value={form.description}
              onChangeText={(t) => setForm((s) => ({ ...s, description: t }))}
              multiline
              editable={isEditing}
            />
          </View>

          <View style={[styles.field, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
            <Text style={styles.label}>Available</Text>
            <TouchableOpacity
              onPress={() => isEditing && setForm((s) => ({ ...s, available: !s.available }))}
              style={[
                styles.switchPill,
                form.available ? styles.switchOn : styles.switchOff,
                !isEditing && { opacity: 0.6 },
              ]}
              disabled={!isEditing}
            >
              <Text style={{ color: form.available ? "#065f46" : "#7c2d12", fontWeight: "700" }}>
                {form.available ? "ON" : "OFF"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.card}>
        <Text style={[styles.sectionTitle, { color: "#b42318" }]}>Danger zone</Text>
        <TouchableOpacity
          style={[styles.dangerBtn, deleting && { opacity: 0.7 }]}
          onPress={confirmDelete}
          disabled={deleting}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.dangerBtnText}>{deleting ? "กำลังลบ…" : "ลบหนังสือเล่มนี้"}</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, backgroundColor: "#f9fafb", flexGrow: 1 },
  center: { alignItems: "center", justifyContent: "center" },

  topRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  iconBtn: {
    width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center",
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb",
  },
  header: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "800" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 10,
    // shadow iOS
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    // elevation Android
    elevation: 2,
  },

  titleRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  title: { fontSize: 20, fontWeight: "800", lineHeight: 26 },
  author: { fontSize: 14, opacity: 0.75, marginTop: 2 },
  desc: { fontSize: 14, opacity: 0.95, marginTop: 10, lineHeight: 20 },

  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 12 },
  badge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
    backgroundColor: "#eaf8f1", color: "#0c6b43", overflow: "hidden",
  },
  badgeMuted: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999,
    backgroundColor: "#f2f4f7", color: "#6b7280", overflow: "hidden",
  },
  badgeStatus: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, fontWeight: "700", overflow: "hidden",
  },
  badgeOk: { backgroundColor: "#e8f7ee", color: "#117a44" },
  badgeNo: { backgroundColor: "#feeceb", color: "#b42318" },
  price: { fontWeight: "800", opacity: 0.9 },

  addedBy: { marginTop: 10, fontSize: 12, color: "#6b7280" },

  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800" },

  formGrid: { gap: 10 },
  field: { gap: 6 },
  label: { fontSize: 12, color: "#6b7280" },
  input: {
    borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#fff", fontSize: 16,
  },

  switchPill: {
    minWidth: 64, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999,
    alignItems: "center", borderWidth: 1,
  },
  switchOn: { backgroundColor: "#e8f7ee", borderColor: "#bbf7d0" },
  switchOff: { backgroundColor: "#feeceb", borderColor: "#fecaca" },

  primaryBtn: {
    backgroundColor: "#2b65ff", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },

  outlineBtn: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1, borderColor: "#cbd5e1", backgroundColor: "#fff",
  },
  outlineBtnText: { color: "#334155", fontWeight: "700" },

  dangerBtn: {
    marginTop: 10, backgroundColor: "#b42318", paddingVertical: 10, borderRadius: 10,
    alignItems: "center", flexDirection: "row", justifyContent: "center", gap: 8,
  },
  dangerBtnText: { color: "#fff", fontWeight: "800" },
});
