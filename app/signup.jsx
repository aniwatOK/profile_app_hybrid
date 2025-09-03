// app/signup.jsx
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
import { router, Link } from "expo-router";
import { apiJson, setToken, getBaseUrl } from "./config/api";

const AUTH_SIGNUP_PATHS = ["/api/auth/register", "/api/auth/signup"];

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPwd1, setShowPwd1] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const [loading, setLoading] = useState(false);
  const [host, setHost] = useState("");

  useEffect(() => {
    try {
      const base = getBaseUrl(); // คืนค่า string (จากไฟล์ config เดียว)
      setHost(base);
    } catch {}
  }, []);

  const validate = () => {
    if (!username.trim()) return "กรุณากรอก Username";
    if (username.trim().length < 3) return "Username ต้องยาวอย่างน้อย 3 ตัวอักษร";
    if (!email.trim()) return "กรุณากรอก Email";
    if (!/.+@.+\..+/.test(email.trim())) return "รูปแบบอีเมลไม่ถูกต้อง";
    if (!password) return "กรุณากรอก Password";
    if (password.length < 6) return "Password ต้องยาวอย่างน้อย 6 ตัวอักษร";
    if (password !== confirm) return "Password และ Confirm ไม่ตรงกัน";
    return null;
  };

  const doSignup = async () => {
    const err = validate();
    if (err) {
      Alert.alert("ข้อมูลไม่ถูกต้อง", err);
      return;
    }

    setLoading(true);
    try {
      let lastErr = null;
      let res = null;

      const payload = {
        username: username.trim(),
        email: email.trim(),
        password,
      };

      for (const path of AUTH_SIGNUP_PATHS) {
        try {
          res = await apiJson(path, {
            method: "POST",
            body: JSON.stringify(payload),
          });
          lastErr = null;
          break; // สำเร็จ ออกเลย
        } catch (e) {
          lastErr = e;
        }
      }
      if (lastErr) throw lastErr;

      // ถ้า API คืน token มาก็เข้าสู่ระบบให้เลย
      const token =
        res?.token || res?.accessToken || res?.jwt || res?.data?.token;

      if (token) {
        await setToken(token);
        Alert.alert("สำเร็จ", "สร้างบัญชีและเข้าสู่ระบบเรียบร้อย");
        router.replace("/signin");
      } else {
        // ถ้าไม่คืน token ให้ไปหน้า Sign In เพื่อเข้าสู่ระบบ
        Alert.alert("สำเร็จ", "สร้างบัญชีแล้ว โปรดเข้าสู่ระบบ");
        router.replace("/signin");
      }
    } catch (e) {
      Alert.alert("สมัครสมาชิกไม่สำเร็จ", String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={s.container}>
      {!!host && <Text style={s.hostHint}>API: {host}</Text>}

      <Text style={s.header}>Sign Up</Text>

      <View style={s.field}>
        <Text style={s.label}>Username</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="yourname"
          autoCapitalize="none"
          autoCorrect={false}
          style={s.input}
        />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
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
            secureTextEntry={!showPwd1}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            style={s.input}
          />
          <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPwd1((x) => !x)}>
            <Text style={{ fontWeight: "700" }}>{showPwd1 ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.field}>
        <Text style={s.label}>Confirm Password</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder="••••••••"
            secureTextEntry={!showPwd2}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            style={s.input}
          />
          <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPwd2((x) => !x)}>
            <Text style={{ fontWeight: "700" }}>{showPwd2 ? "Hide" : "Show"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ปุ่มสร้างบัญชี */}
      <TouchableOpacity
        style={[s.primaryBtn, loading && { opacity: 0.7 }]}
        onPress={doSignup}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryBtnText}>Create Account</Text>}
      </TouchableOpacity>

      {/* ลิงก์กลับไปหน้า Sign In */}
      <Link href="/signin" asChild>
        <TouchableOpacity style={s.secondaryBtn}>
          <Text style={s.secondaryBtnText}>มีบัญชีแล้ว? Sign In</Text>
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
