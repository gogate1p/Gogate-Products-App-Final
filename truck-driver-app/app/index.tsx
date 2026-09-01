import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import {
  useState
} from "react";

import {
  router
} from "expo-router";

import {
  LinearGradient
} from "expo-linear-gradient";

import * as Haptics from "expo-haptics";

import {
  ArrowRight,
  LockKeyhole,
  MapPin,
  Phone,
  Route,
  ShieldCheck,
  Truck
} from "lucide-react-native";

import {
  api,
  saveToken
} from "../src/api";

import {
  colors
} from "../src/theme";

export default function Login() {
  const [
    phone,
    setPhone
  ] =
    useState("");

  const [
    password,
    setPassword
  ] =
    useState("");

  const [
    loading,
    setLoading
  ] =
    useState(false);

  async function submit() {

    if (
      !phone.trim() ||
      !password
    ) {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning
      );

      Alert.alert(
        "Enter login details",
        "Mobile number and password are required."
      );

      return;
    }

    setLoading(true);

    try {

      const response =
        await api.post(
          "/auth/login",
          {
            phone:
              phone.trim(),

            password
          }
        );

      const token =
        response.data?.access_token ??
        response.data?.accessToken ??
        response.data?.token;

      if (!token) {
        throw new Error(
          "Authentication token was not returned."
        );
      }

      await saveToken(
        token
      );

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      router.replace(
        "/dashboard"
      );

    } catch (
      error:
        any
    ) {

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error
      );

      Alert.alert(
        "Login failed",

        error?.response?.data?.message ??
        error?.message ??
        "Unable to login."
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1
      }}

      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <ScrollView
        style={styles.screen}

        contentContainerStyle={
          styles.content
        }

        keyboardShouldPersistTaps="handled"

        showsVerticalScrollIndicator={
          false
        }
      >

        <LinearGradient
          colors={[
            "#0284c7",
            "#0891b2",
            "#10b981"
          ]}

          style={styles.hero}
        >

          <View style={styles.logoCircle}>

            <Truck
              size={42}
              color="#ffffff"
            />

          </View>

          <Text style={styles.brand}>
            GOGATE PRODUCTS
          </Text>

          <Text style={styles.title}>
            Truck Driver
          </Text>

          <Text style={styles.subtitle}>
            Line-haul operations,
            manifests and hub transfers
            in one secure app.
          </Text>

          <View style={styles.features}>

            <View style={styles.feature}>
              <Route
                size={15}
                color="#ffffff"
              />

              <Text style={styles.featureText}>
                Trips
              </Text>
            </View>

            <View style={styles.feature}>
              <MapPin
                size={15}
                color="#ffffff"
              />

              <Text style={styles.featureText}>
                GPS
              </Text>
            </View>

            <View style={styles.feature}>
              <ShieldCheck
                size={15}
                color="#ffffff"
              />

              <Text style={styles.featureText}>
                Secure
              </Text>
            </View>

          </View>

        </LinearGradient>

        <View style={styles.form}>

          <Text style={styles.welcome}>
            Driver login
          </Text>

          <Text style={styles.description}>
            Sign in to view your assigned trips and vehicle.
          </Text>

          <Text style={styles.label}>
            Mobile number
          </Text>

          <View style={styles.inputRow}>

            <Phone
              size={19}
              color={colors.primary}
            />

            <TextInput
              value={phone}

              onChangeText={
                setPhone
              }

              keyboardType="phone-pad"

              placeholder="Mobile number"

              placeholderTextColor={
                colors.soft
              }

              style={styles.input}
            />

          </View>

          <Text style={styles.passwordLabel}>
            Password
          </Text>

          <View style={styles.inputRow}>

            <LockKeyhole
              size={19}
              color={colors.primary}
            />

            <TextInput
              value={password}

              onChangeText={
                setPassword
              }

              secureTextEntry

              placeholder="Password"

              placeholderTextColor={
                colors.soft
              }

              style={styles.input}
            />

          </View>

          <Pressable
            onPress={
              submit
            }

            style={styles.button}
          >

            {loading ? (

              <ActivityIndicator
                color="#ffffff"
              />

            ) : (

              <>
                <Text style={styles.buttonText}>
                  Start Driver App
                </Text>

                <ArrowRight
                  size={19}
                  color="#ffffff"
                />
              </>

            )}

          </Pressable>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles =
  StyleSheet.create({

    screen: {
      flex: 1,

      backgroundColor:
        colors.background
    },

    content: {
      flexGrow: 1
    },

    hero: {
      minHeight: 390,

      paddingTop: 70,

      paddingHorizontal: 24,

      paddingBottom: 45,

      borderBottomLeftRadius: 36,

      borderBottomRightRadius: 36
    },

    logoCircle: {
      width: 78,

      height: 78,

      borderRadius: 25,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        "rgba(255,255,255,.16)"
    },

    brand: {
      marginTop: 27,

      fontSize: 12,

      fontWeight: "900",

      letterSpacing: 1.8,

      color:
        "rgba(255,255,255,.82)"
    },

    title: {
      marginTop: 7,

      fontSize: 39,

      fontWeight: "900",

      color: "#ffffff"
    },

    subtitle: {
      marginTop: 10,

      maxWidth: 290,

      fontSize: 15,

      lineHeight: 23,

      color:
        "rgba(255,255,255,.82)"
    },

    features: {
      marginTop: 27,

      flexDirection: "row",

      gap: 9
    },

    feature: {
      flexDirection: "row",

      alignItems: "center",

      gap: 6,

      borderRadius: 999,

      paddingHorizontal: 12,

      paddingVertical: 8,

      backgroundColor:
        "rgba(255,255,255,.13)"
    },

    featureText: {
      fontSize: 11,

      fontWeight: "800",

      color: "#ffffff"
    },

    form: {
      marginTop: -15,

      marginHorizontal: 20,

      marginBottom: 30,

      padding: 21,

      borderRadius: 27,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border
    },

    welcome: {
      fontSize: 27,

      fontWeight: "900",

      color:
        colors.text
    },

    description: {
      marginTop: 6,

      marginBottom: 24,

      fontSize: 13,

      lineHeight: 20,

      color:
        colors.muted
    },

    label: {
      fontSize: 12,

      fontWeight: "900",

      color:
        colors.textSecondary
    },

    passwordLabel: {
      marginTop: 17,

      fontSize: 12,

      fontWeight: "900",

      color:
        colors.textSecondary
    },

    inputRow: {
      marginTop: 8,

      height: 56,

      paddingHorizontal: 15,

      gap: 11,

      flexDirection: "row",

      alignItems: "center",

      borderRadius: 17,

      borderWidth: 1,

      borderColor:
        colors.border,

      backgroundColor:
        colors.surfaceSoft
    },

    input: {
      flex: 1,

      color:
        colors.text
    },

    button: {
      marginTop: 24,

      height: 58,

      borderRadius: 18,

      flexDirection: "row",

      gap: 10,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        colors.primary
    },

    buttonText: {
      color: "#ffffff",

      fontSize: 15,

      fontWeight: "900"
    }
  });