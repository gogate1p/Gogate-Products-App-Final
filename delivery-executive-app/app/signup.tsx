import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";

import { colors } from "../src/theme";
import { api } from "../src/api";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    try {
      await api.post(
        "/workforce/riders/signup",
        {
          name,
          phone,
          password,
        }
      );

      Alert.alert(
        "Account created",
        "Continue to sign in."
      );

      router.replace("/");
    } catch (error: any) {
      Alert.alert(
        "Signup failed",
        error?.response?.data?.message ??
          error?.message ??
          "Unable to create account."
      );
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>
          â† Back
        </Text>
      </Pressable>

      <Text style={styles.heading}>
        Become a Delivery Executive
      </Text>

      <Text style={styles.subtitle}>
        Create your Gogate Products delivery account.
      </Text>

      <View style={styles.card}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full name"
          placeholderTextColor={colors.textSoft}
          style={styles.input}
        />

        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Mobile number"
          placeholderTextColor={colors.textSoft}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Create password"
          placeholderTextColor={colors.textSoft}
          secureTextEntry
          style={styles.input}
        />

        <Pressable
          onPress={submit}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Create Account
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 22,
    paddingTop: 65,
  },

  back: {
    color: colors.primary,
    fontWeight: "900",
  },

  heading: {
    marginTop: 28,
    fontSize: 32,
    fontWeight: "900",
    color: colors.text,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: colors.textMuted,
  },

  card: {
    marginTop: 28,
    padding: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  input: {
    minHeight: 54,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },

  button: {
    minHeight: 56,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },

  buttonText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
  },
});