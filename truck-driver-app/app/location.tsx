import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import {
  useState
} from "react";

import * as Location from "expo-location";

import {
  MapPin,
  Navigation
} from "lucide-react-native";

import {
  colors
} from "../src/theme";

import {
  sendLocation
} from "../src/truck-driver";

export default function LocationPage() {

  const [
    sending,
    setSending
  ] =
    useState(false);

  async function updateLocation() {

    setSending(
      true
    );

    try {

      const result =
        await Location.requestForegroundPermissionsAsync();

      if (
        result.status !==
        "granted"
      ) {
        throw new Error(
          "Location permission denied."
        );
      }

      const position =
        await Location.getCurrentPositionAsync({
          accuracy:
            Location.Accuracy.High
        });

      const response =
        await sendLocation({
          lat:
            position.coords.latitude,

          lng:
            position.coords.longitude,

          accuracy:
            position.coords.accuracy ??
            undefined
        });

      Alert.alert(
        "Location updated",

        JSON.stringify(
          response
        )
      );

    } catch (
      error:
        any
    ) {

      Alert.alert(
        "Unable to update location",

        error?.response?.data?.message ??
        error?.message ??
        "Location operation failed."
      );

    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.screen}>

      <View style={styles.icon}>

        <Navigation
          size={34}
          color={colors.primary}
        />

      </View>

      <Text style={styles.title}>
        Live Trip Location
      </Text>

      <Text style={styles.subtitle}>
        Share the truck's current GPS position with Gogate Products operations.
      </Text>

      <View style={styles.info}>

        <MapPin
          size={20}
          color={colors.success}
        />

        <Text style={styles.infoText}>
          Location is sent securely through the NestJS backend.
        </Text>

      </View>

      <Pressable
        style={styles.button}

        onPress={
          updateLocation
        }
      >

        <Text style={styles.buttonText}>
          {
            sending
              ? "Updating..."
              : "Update Current Location"
          }
        </Text>

      </Pressable>

    </View>
  );
}

const styles =
  StyleSheet.create({

    screen: {
      flex: 1,

      padding: 24,

      paddingTop: 90,

      backgroundColor:
        colors.background
    },

    icon: {
      width: 68,

      height: 68,

      borderRadius: 22,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        colors.primarySoft
    },

    title: {
      marginTop: 24,

      fontSize: 30,

      fontWeight: "900",

      color:
        colors.text
    },

    subtitle: {
      marginTop: 9,

      fontSize: 14,

      lineHeight: 22,

      color:
        colors.muted
    },

    info: {
      marginTop: 30,

      padding: 17,

      borderRadius: 20,

      gap: 10,

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        colors.successSoft
    },

    infoText: {
      flex: 1,

      fontSize: 12,

      lineHeight: 18,

      color:
        colors.successDark
    },

    button: {
      marginTop: 28,

      minHeight: 58,

      borderRadius: 18,

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