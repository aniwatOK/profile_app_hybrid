import { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";

/**
 * ใช้ห่อหน้าใดๆ ที่ต้องการให้ผ่าน Local Authentication ก่อน
 * <RequireLocalAuth><YourScreen/></RequireLocalAuth>
 */
export default function RequireLocalAuth({ children, allowBypassWhenUnsupported = false }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [supported, setSupported] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const hasHw = await LocalAuthentication.hasHardwareAsync();
        const hasEnroll = hasHw ? await LocalAuthentication.isEnrolledAsync() : false;
        if (!mounted) return;
        setSupported(hasHw);
        setEnrolled(hasEnroll);
        if (hasHw && hasEnroll) {
          await doAuth();
        }
      } catch (e) {
        setErr("ไม่สามารถตรวจสอบอุปกรณ์ได้");
      } finally {
        setChecking(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const doAuth = async () => {
    setErr("");
    try {
      const res = await LocalAuthentication.authenticateAsync({
        promptMessage: "ยืนยันตัวตนเพื่อเข้า Book_CRUD",
        fallbackLabel: "ใช้รหัสผ่านเครื่อง",
        cancelLabel: "ยกเลิก",
        disableDeviceFallback: false,
      });
      if (res.success) setUnlocked(true);
      else setErr(res.error ?? "ยืนยันตัวตนไม่สำเร็จ");
    } catch {
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถยืนยันตัวตนได้");
    }
  };

  if (checking) {
    return (
      <View style={S.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>กำลังตรวจสอบอุปกรณ์…</Text>
      </View>
    );
  }

  // เครื่องไม่รองรับหรือยังไม่ตั้งค่า biometrics/PIN
  if (!supported || !enrolled) {
    if (allowBypassWhenUnsupported) {
      // ถ้าอนุญาตให้ผ่านได้เมื่อไม่รองรับ
      return <View style={{ flex: 1 }}>{children}</View>;
    }
    return (
      <View style={S.center}>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          อุปกรณ์ไม่รองรับหรือยังไม่ได้ตั้งค่า Biometrics/PIN
        </Text>
        <Button title="กลับ" onPress={() => router.back()} />
      </View>
    );
  }

  // รองรับแล้วแต่ยังไม่ปลดล็อก
  if (!unlocked) {
    return (
      <View style={S.center}>
        {!!err && <Text style={{ color: "red", marginBottom: 8 }}>{err}</Text>}
        <Button title="ยืนยันตัวตน" onPress={doAuth} />
        <View style={{ height: 8 }} />
        <Button title="ยกเลิก" onPress={() => router.back()} />
      </View>
    );
  }

  // ผ่านแล้ว แสดงหน้าที่ห่อไว้
  return <View style={{ flex: 1 }}>{children}</View>;
}

const S = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
});
