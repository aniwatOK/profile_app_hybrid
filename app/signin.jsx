// app/signin.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router, Link } from "expo-router"; // ← เพิ่ม Link ตรงนี้
import { apiJson, setToken, getBaseUrl } from "./config/api";

// ลอง /login ก่อน แล้วค่อย fallback /signin
const AUTH_PATHS = ["/api/auth/login", "/api/auth/signin"];

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [host, setHost] = useState("");

  useEffect(() => {
    try {
      const base = getBaseUrl(); // คืนค่า string
      setHost(base);
    } catch {}
  }, []);

  const doSignin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("กรอกข้อมูลไม่ครบ", "โปรดกรอกอีเมลและรหัสผ่าน");
      return;
    }

    setLoading(true);
    try {
      let lastErr = null;
      let res = null;

      for (const path of AUTH_PATHS) {
        try {
          res = await apiJson(path, {
            method: "POST",
            body: JSON.stringify({ email: email.trim(), password }),
          });
          lastErr = null;
          break;
        } catch (e) {
          lastErr = e;
        }
      }
      if (lastErr) throw lastErr;

      const token =
        res?.token || res?.accessToken || res?.jwt || res?.data?.token;
      if (!token) throw new Error("ไม่พบ token ในผลลัพธ์จากเซิร์ฟเวอร์");

      await setToken(token);
      Alert.alert("สำเร็จ", "ลงชื่อเข้าใช้เรียบร้อย");
      router.replace("/book");
    } catch (e) {
      Alert.alert("เข้าสู่ระบบไม่สำเร็จ", String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      {!!host && <Text style={s.hostHint}>API: {host}</Text>}

      <Text style={s.header}>Sign In</Text>

      <View style={s.field}>
        <Text style={s.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="admin@cis.kku.ac.th"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="username"
          style={s.input}
        />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Password</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry={!showPwd}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            style={s.input}
          />
          <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPwd((x) => !x)}>
            <Text style={{ fontWeight: "700" }}>{showPwd ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ปุ่ม Sign In */}
      <TouchableOpacity
        style={[s.primaryBtn, loading && { opacity: 0.7 }]}
        onPress={doSignin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.primaryBtnText}>Sign In</Text>
        )}
      </TouchableOpacity>

      {/* ปุ่ม Sign Up → /signup */}
      <Link href="/signup" asChild>
        <TouchableOpacity style={s.secondaryBtn}>
          <Text style={s.secondaryBtnText}>Sign Up</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingVertical: 24, paddingHorizontal: 20, flex: 1, backgroundColor: "#f9fafb" },
  hostHint: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  header: { fontSize: 26, fontWeight: "800", marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { fontSize: 12, color: "#6b7280", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  eyeBtn: { position: "absolute", right: 12, top: 10, padding: 4 },

  primaryBtn: {
    backgroundColor: "#2b65ff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  // ปุ่ม Sign Up (outline)
  secondaryBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
  },
  secondaryBtnText: { color: "#334155", fontWeight: "700", fontSize: 16 },
});
