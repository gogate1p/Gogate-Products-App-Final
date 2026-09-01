import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import {
  useState,
} from "react";

import * as Location from "expo-location";

import {
  MapPin,
} from "lucide-react-native";

import {
  colors,
} from "../src/theme";

import {
  checkIn,
  checkOut,
} from "../src/workforce";

export default function CheckInScreen() {
  const [
    loading,
    setLoading,
  ] =
    useState(false);

  async function getLocation() {
    const {
      status,
    } =
      await Location
        .requestForegroundPermissionsAsync();

    if (
      status !==
      "granted"
    ) {
      throw new Error(
        "Location permission denied",
      );
    }

    return Location
      .getCurrentPositionAsync({
        accuracy:
          Location.Accuracy.High,
      });
  }

  async function perform(
    mode:
      "IN" |
      "OUT",
  ) {
    setLoading(true);

    try {
      const location =
        await getLocation();

      const payload = {
        lat:
          location.coords.latitude,

        lng:
          location.coords.longitude,

        gpsAccuracy:
          location.coords.accuracy ??
          undefined,
      };

      const response =
        mode === "IN"
          ? await checkIn(
              payload,
            )
          : await checkOut(
              payload,
            );

      Alert.alert(
        mode === "IN"
          ? "Checked in"
          : "Checked out",

        JSON.stringify(
          response,
        ),
      );
    } catch (
      error:
        any
    ) {
      Alert.alert(
        "Unable to continue",
        error?.response?.data?.message ??
        error?.message ??
        "Location operation failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>

      <View style={styles.icon}>
        <MapPin
          size={32}
          color={colors.primary}
        />
      </View>

      <Text style={styles.heading}>
        Hub Attendance
      </Text>

      <Text style={styles.subtitle}>
        GPS location is captured for hub check-in and check-out.
      </Text>

      <Pressable
        onPress={
          () =>
            perform(
              "IN",
            )
        }
        style={styles.primary}
        disabled={
          loading
        }
      >
        {loading ? (
          <ActivityIndicator
            color="#ffffff"
          />
        ) : (
          <Text style={styles.primaryText}>
            Check In
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={
          () =>
            perform(
              "OUT",
            )
        }
        style={styles.secondary}
        disabled={
          loading
        }
      >
        <Text style={styles.secondaryText}>
          Check Out
        </Text>
      </Pressable>

    </View>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex:
        1,
      paddingHorizontal:
        24,
      paddingTop:
        100,
      backgroundColor:
        colors.background,
    },

    icon: {
      width:
        64,
      height:
        64,
      borderRadius:
        20,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        colors.primarySoft,
    },

    heading: {
      marginTop:
        24,
      fontSize:
        31,
      fontWeight:
        "900",
      color:
        colors.text,
    },

    subtitle: {
      marginTop:
        10,
      fontSize:
        15,
      lineHeight:
        23,
      color:
        colors.textMuted,
    },

    primary: {
      marginTop:
        34,
      minHeight:
        58,
      borderRadius:
        18,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        colors.primary,
    },

    primaryText: {
      color:
        "#ffffff",
      fontSize:
        16,
      fontWeight:
        "900",
    },

    secondary: {
      marginTop:
        12,
      minHeight:
        58,
      borderRadius:
        18,
      alignItems:
        "center",
      justifyContent:
        "center",
      borderWidth:
        1,
      borderColor:
        colors.border,
      backgroundColor:
        colors.surface,
    },

    secondaryText: {
      color:
        colors.text,
      fontSize:
        16,
      fontWeight:
        "900",
    },
  });