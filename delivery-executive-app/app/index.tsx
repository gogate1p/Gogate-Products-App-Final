import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  router,
} from "expo-router";

import {
  LinearGradient,
} from "expo-linear-gradient";

import * as Haptics from "expo-haptics";

import {
  useAudioPlayer,
} from "expo-audio";

import {
  ArrowRight,
  Bike,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  MapPin,
  PackageCheck,
  Phone,
  Route,
  ScanLine,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react-native";

import {
  colors,
  shadows,
} from "../src/theme";

import {
  api,
  saveToken,
} from "../src/api";

const WIDTH =
  Dimensions.get("window").width;

export default function LoginScreen() {
  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const fade =
    useRef(
      new Animated.Value(0),
    ).current;

  const translate =
    useRef(
      new Animated.Value(28),
    ).current;

  const float =
    useRef(
      new Animated.Value(0),
    ).current;

  const player =
    useAudioPlayer(
      require("../assets/sounds/success.wav"),
    );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(
        fade,
        {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        },
      ),

      Animated.spring(
        translate,
        {
          toValue: 0,
          damping: 18,
          stiffness: 120,
          useNativeDriver: true,
        },
      ),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(
          float,
          {
            toValue: -8,
            duration: 1800,
            useNativeDriver: true,
          },
        ),

        Animated.timing(
          float,
          {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          },
        ),
      ]),
    ).start();
  }, []);

  async function login() {
    if (!phone.trim() || !password) {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Warning,
      );

      Alert.alert(
        "Enter your details",
        "Mobile number and password are required.",
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

            password,
          },
        );

      const token =
        response.data?.access_token ??
        response.data?.accessToken ??
        response.data?.token;

      if (!token) {
        throw new Error(
          "Authentication token was not returned.",
        );
      }

      await saveToken(
        token,
      );

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success,
      );

      try {
        player.seekTo(0);
        player.play();
      } catch {}

      setTimeout(
        () =>
          router.replace(
            "/dashboard",
          ),
        220,
      );
    } catch (
      error:
        any
    ) {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Error,
      );

      Alert.alert(
        "Unable to sign in",
        error?.response?.data?.message ??
        error?.message ??
        "Please check your credentials and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.hero}>

          <LinearGradient
            colors={[
              "#0284c7",
              "#0891b2",
              "#10b981",
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={StyleSheet.absoluteFill}
          />

          <View style={styles.heroCircleOne} />
          <View style={styles.heroCircleTwo} />

          <Animated.View
            style={[
              styles.deliveryGraphic,
              {
                transform: [
                  {
                    translateY:
                      float,
                  },
                ],
              },
            ]}
          >

            <View style={styles.road} />

            <View style={styles.pinOne}>
              <MapPin
                size={18}
                color={colors.primary}
              />
            </View>

            <View style={styles.pinTwo}>
              <PackageCheck
                size={17}
                color={colors.successDark}
              />
            </View>

            <View style={styles.bikeCircle}>
              <Bike
                size={38}
                color="#ffffff"
              />
            </View>

          </Animated.View>

          <View style={styles.heroBadge}>
            <Zap
              size={14}
              color="#ffffff"
            />

            <Text style={styles.heroBadgeText}>
              Delivery Executive
            </Text>
          </View>

          <Text style={styles.brand}>
            Gogate Products
          </Text>

          <Text style={styles.heroTitle}>
            Deliver smarter.
            {"\n"}
            Move faster.
          </Text>

          <Text style={styles.heroSubtitle}>
            Your complete delivery operations app.
          </Text>

          <View style={styles.heroFeatures}>

            <Feature
              icon={ScanLine}
              text="Smart Scan"
            />

            <Feature
              icon={Route}
              text="Live Routes"
            />

            <Feature
              icon={ShieldCheck}
              text="Secure"
            />

          </View>

        </View>

        <Animated.View
          style={[
            styles.formWrapper,
            {
              opacity:
                fade,

              transform: [
                {
                  translateY:
                    translate,
                },
              ],
            },
          ]}
        >

          <Text style={styles.welcome}>
            Welcome back
          </Text>

          <Text style={styles.description}>
            Sign in to start your shift and manage today's deliveries.
          </Text>

          <View style={styles.formCard}>

            <Text style={styles.label}>
              Mobile number
            </Text>

            <View style={styles.inputContainer}>

              <View style={styles.inputIcon}>
                <Phone
                  size={19}
                  color={colors.primary}
                />
              </View>

              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Enter mobile number"
                placeholderTextColor={colors.textSoft}
                style={styles.input}
              />

            </View>

            <Text style={styles.passwordLabel}>
              Password
            </Text>

            <View style={styles.inputContainer}>

              <View style={styles.inputIcon}>
                <LockKeyhole
                  size={19}
                  color={colors.primary}
                />
              </View>

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor={colors.textSoft}
                secureTextEntry={!showPassword}
                style={styles.input}
              />

              <Pressable
                onPress={() =>
                  setShowPassword(
                    !showPassword,
                  )
                }
                style={styles.eye}
              >

                {showPassword ? (
                  <EyeOff
                    size={19}
                    color={colors.textMuted}
                  />
                ) : (
                  <Eye
                    size={19}
                    color={colors.textMuted}
                  />
                )}

              </Pressable>

            </View>

            <Pressable
              onPress={() =>
                Haptics.selectionAsync()
              }
              style={styles.forgot}
            >
              <Text style={styles.forgotText}>
                Forgot password?
              </Text>
            </Pressable>

            <Pressable
              onPress={login}
              disabled={loading}
              style={({ pressed }) => [
                styles.signInButton,
                pressed && {
                  transform: [
                    {
                      scale:
                        0.985,
                    },
                  ],
                },
              ]}
            >

              <LinearGradient
                colors={[
                  colors.primary,
                  colors.primaryDark,
                ]}
                start={{
                  x: 0,
                  y: 0,
                }}
                end={{
                  x: 1,
                  y: 1,
                }}
                style={styles.buttonGradient}
              >

                {loading ? (
                  <ActivityIndicator
                    color="#ffffff"
                  />
                ) : (
                  <>
                    <Text style={styles.buttonText}>
                      Start Delivery
                    </Text>

                    <ArrowRight
                      size={19}
                      color="#ffffff"
                    />
                  </>
                )}

              </LinearGradient>

            </Pressable>

          </View>

          <View style={styles.secureRow}>

            <CheckCircle2
              size={16}
              color={colors.success}
            />

            <Text style={styles.secureText}>
              Secure access â€¢ Location protected â€¢ Activity logged
            </Text>

          </View>

          <View style={styles.signupBox}>

            <View>
              <Text style={styles.newTitle}>
                New delivery executive?
              </Text>

              <Text style={styles.newSubtitle}>
                Join the Gogate delivery network.
              </Text>
            </View>

            <Pressable
              onPress={() => {
                Haptics.selectionAsync();

                router.push(
                  "/signup",
                );
              }}
              style={styles.createButton}
            >
              <Text style={styles.createText}>
                Apply
              </Text>
            </Pressable>

          </View>

        </Animated.View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

function Feature({
  icon: Icon,
  text,
}: {
  icon:
    any;

  text:
    string;
}) {
  return (
    <View style={styles.feature}>

      <Icon
        size={14}
        color="#ffffff"
      />

      <Text style={styles.featureText}>
        {text}
      </Text>

    </View>
  );
}

const styles =
  StyleSheet.create({
    flex: {
      flex: 1,
    },

    screen: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    content: {
      flexGrow: 1,
      paddingBottom: 34,
    },

    hero: {
      minHeight: 350,
      paddingHorizontal: 22,
      paddingTop: 64,
      paddingBottom: 36,
      overflow: "hidden",
      borderBottomLeftRadius: 34,
      borderBottomRightRadius: 34,
    },

    heroCircleOne: {
      position: "absolute",
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor:
        "rgba(255,255,255,.08)",
      right: -70,
      top: -55,
    },

    heroCircleTwo: {
      position: "absolute",
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor:
        "rgba(255,255,255,.06)",
      left: -35,
      bottom: -30,
    },

    deliveryGraphic: {
      position: "absolute",
      width: 150,
      height: 150,
      right: 18,
      top: 56,
      borderRadius: 75,
      backgroundColor:
        "rgba(255,255,255,.11)",
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,.15)",
      alignItems: "center",
      justifyContent: "center",
    },

    road: {
      position: "absolute",
      width: 94,
      height: 3,
      backgroundColor:
        "rgba(255,255,255,.40)",
      transform: [
        {
          rotate: "-28deg",
        },
      ],
    },

    pinOne: {
      position: "absolute",
      left: 18,
      bottom: 25,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor:
        "#ffffff",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    pinTwo: {
      position: "absolute",
      right: 18,
      top: 26,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor:
        "#ffffff",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    bikeCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        "rgba(255,255,255,.16)",
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,.25)",
    },

    heroBadge: {
      flexDirection: "row",
      gap: 7,
      alignItems: "center",
      alignSelf: "flex-start",
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor:
        "rgba(255,255,255,.15)",
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,.18)",
    },

    heroBadgeText: {
      fontSize: 11,
      fontWeight: "900",
      letterSpacing: 0.8,
      textTransform:
        "uppercase",
      color: "#ffffff",
    },

    brand: {
      marginTop: 22,
      fontSize: 13,
      fontWeight: "900",
      letterSpacing: 1.6,
      color:
        "rgba(255,255,255,.85)",
      textTransform:
        "uppercase",
    },

    heroTitle: {
      marginTop: 8,
      maxWidth:
        WIDTH * 0.68,
      fontSize: 36,
      lineHeight: 41,
      fontWeight: "900",
      letterSpacing: -1.2,
      color: "#ffffff",
    },

    heroSubtitle: {
      marginTop: 10,
      maxWidth: 240,
      fontSize: 14,
      lineHeight: 21,
      color:
        "rgba(255,255,255,.82)",
    },

    heroFeatures: {
      marginTop: 25,
      flexDirection:
        "row",
      gap: 8,
    },

    feature: {
      flexDirection:
        "row",
      gap: 5,
      alignItems:
        "center",
      paddingHorizontal:
        10,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor:
        "rgba(255,255,255,.12)",
    },

    featureText: {
      fontSize: 10,
      fontWeight: "800",
      color: "#ffffff",
    },

    formWrapper: {
      marginTop: -16,
      paddingHorizontal: 20,
    },

    welcome: {
      marginTop: 32,
      fontSize: 27,
      fontWeight: "900",
      letterSpacing: -.5,
      color: colors.text,
    },

    description: {
      marginTop: 7,
      fontSize: 14,
      lineHeight: 21,
      color:
        colors.textMuted,
    },

    formCard: {
      marginTop: 22,
      padding: 18,
      borderRadius: 25,
      backgroundColor:
        colors.surface,
      borderWidth: 1,
      borderColor:
        colors.border,
      ...shadows.card,
    },

    label: {
      fontSize: 12,
      fontWeight: "900",
      color:
        colors.textSecondary,
    },

    passwordLabel: {
      marginTop: 16,
      fontSize: 12,
      fontWeight: "900",
      color:
        colors.textSecondary,
    },

    inputContainer: {
      marginTop: 8,
      height: 56,
      borderRadius: 17,
      borderWidth: 1,
      borderColor:
        colors.border,
      backgroundColor:
        colors.surfaceSoft,
      flexDirection:
        "row",
      alignItems:
        "center",
    },

    inputIcon: {
      width: 48,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    input: {
      flex: 1,
      height: "100%",
      color: colors.text,
      fontSize: 15,
      fontWeight: "600",
    },

    eye: {
      width: 48,
      height: "100%",
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    forgot: {
      alignSelf:
        "flex-end",
      marginTop: 13,
    },

    forgotText: {
      fontSize: 12,
      fontWeight: "900",
      color:
        colors.primary,
    },

    signInButton: {
      marginTop: 20,
      borderRadius: 17,
      overflow: "hidden",
      ...shadows.primary,
    },

    buttonGradient: {
      height: 57,
      alignItems:
        "center",
      justifyContent:
        "center",
      flexDirection:
        "row",
      gap: 10,
    },

    buttonText: {
      fontSize: 15,
      fontWeight: "900",
      color: "#ffffff",
    },

    secureRow: {
      marginTop: 17,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "center",
      gap: 7,
    },

    secureText: {
      fontSize: 10,
      fontWeight: "700",
      color:
        colors.textMuted,
    },

    signupBox: {
      marginTop: 23,
      padding: 17,
      borderRadius: 21,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
      backgroundColor:
        colors.primarySoft,
      borderWidth: 1,
      borderColor:
        "#bae6fd",
    },

    newTitle: {
      fontSize: 13,
      fontWeight: "900",
      color:
        colors.text,
    },

    newSubtitle: {
      marginTop: 3,
      fontSize: 11,
      color:
        colors.textMuted,
    },

    createButton: {
      paddingHorizontal: 18,
      paddingVertical: 11,
      borderRadius: 14,
      backgroundColor:
        colors.surface,
      borderWidth: 1,
      borderColor:
        "#bae6fd",
    },

    createText: {
      fontSize: 12,
      fontWeight: "900",
      color:
        colors.primary,
    },
  });