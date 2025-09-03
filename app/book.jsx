import { router, Link } from "expo-router";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from "react-native";
import { apiFetch } from "./config/api";

const Book = () => {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    try {
      setError("");
      const res = await apiFetch(`/api/books?page=1&limit=20`);
      const json = await res.json();
      setData(json?.books ?? []);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBooks();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((b) => {
      const t = (b.title || "").toLowerCase();
      const a = (b.author || "").toLowerCase();
      const d = (b.description || "").toLowerCase();
      return t.includes(q) || a.includes(q) || d.includes(q);
    });
  }, [data, query]);

  const renderItem = ({ item }) => {
    const letter = (item.title || "?").slice(0, 1).toUpperCase();
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => router.push(`/book_detail?id=${item._id}`)}
      >
        <View style={styles.row}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{letter}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>

            {!!item.description && (
              <Text style={styles.desc} numberOfLines={2}>
                {item.description}
              </Text>
            )}

            <View style={styles.metaRow}>
              {!!item.genre && <Text style={styles.badge}>{item.genre}</Text>}
              {!!item.year && <Text style={styles.badgeMuted}>{item.year}</Text>}

              {typeof item.price !== "undefined" && item.price !== null && (
                <Text style={styles.price}>
                  ฿{Number(item.price).toFixed(2)}
                </Text>
              )}

              <Text
                style={[
                  styles.badgeStatus,
                  item.available ? styles.badgeOk : styles.badgeNo,
                ]}
              >
                {item.available ? "Available" : "Unavailable"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>กำลังโหลดรายการหนังสือ…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: "red", textAlign: "center" }}>
          โหลดข้อมูลไม่สำเร็จ:
          {"\n"}
          {error}
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={fetchBooks}>
          <Text style={styles.primaryBtnText}>ลองใหม่</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.header}>Books</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Link href="/signin" asChild>
            <TouchableOpacity style={styles.outlineBtn}>
              <Text style={styles.outlineBtnText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/book_new" asChild>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>+ New</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>


      {/* Search */}
      <View style={styles.searchBox}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="ค้นหาด้วยชื่อผู้แต่ง/ชื่อเรื่อง/คำอธิบาย…"
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ paddingVertical: 8 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={[styles.center, { paddingVertical: 40 }]}>
            <Text style={{ opacity: 0.7, marginBottom: 10 }}>
              ไม่พบหนังสือที่ตรงกับคำค้นหา
            </Text>
            <Link href="/book_new" asChild>
              <TouchableOpacity style={styles.outlineBtn}>
                <Text style={styles.outlineBtnText}>สร้างเล่มแรกเลย</Text>
              </TouchableOpacity>
            </Link>
          </View>
        }
      />
    </View>
  );
};

export default Book;

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    marginHorizontal: 20,
    alignItems: "stretch",
  },
  center: { alignItems: "center", justifyContent: "center" },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  header: { fontSize: 26, fontWeight: "800", letterSpacing: 0.2 },

  searchBox: {
    backgroundColor: "#f4f6f8",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e7ebef",
  },
  searchInput: { fontSize: 16 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ebedf0",
    // shadow iOS
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    // elevation Android
    elevation: 2,
  },
  row: { flexDirection: "row", gap: 12 },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e8f0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "800", color: "#2b65ff" },

  title: { fontSize: 18, fontWeight: "700" },
  author: { fontSize: 14, opacity: 0.75, marginTop: 2 },
  desc: { fontSize: 14, opacity: 0.9, marginTop: 8, lineHeight: 20 },

  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    marginTop: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#eaf8f1",
    color: "#0c6b43",
    overflow: "hidden",
  },
  badgeMuted: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#f2f4f7",
    color: "#6b7280",
    overflow: "hidden",
  },
  badgeStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: "600",
    overflow: "hidden",
    marginLeft: "auto",
  },
  badgeOk: { backgroundColor: "#e8f7ee", color: "#117a44" },
  badgeNo: { backgroundColor: "#feeceb", color: "#b42318" },
  price: { fontWeight: "700", opacity: 0.9 },

  primaryBtn: {
    backgroundColor: "#2b65ff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },

  outlineBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
  },
  outlineBtnText: { color: "#334155", fontWeight: "700" },
});
