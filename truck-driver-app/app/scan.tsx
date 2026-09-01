import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";

import {
  CameraView,
  useCameraPermissions
} from "expo-camera";

import {
  useState
} from "react";

import {
  router
} from "expo-router";

import {
  scanTruckItem
} from "../src/truck-driver";

import {
  colors
} from "../src/theme";

export default function Scan() {

  const [
    permission,
    requestPermission
  ] =
    useCameraPermissions();

  const [
    locked,
    setLocked
  ] =
    useState(false);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>
          Loading camera...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>

        <Text style={styles.permissionTitle}>
          Camera permission required
        </Text>

        <Pressable
          style={styles.permissionButton}

          onPress={
            requestPermission
          }
        >

          <Text style={styles.permissionButtonText}>
            Allow Camera
          </Text>

        </Pressable>

      </View>
    );
  }

  async function scanned(
    data: string
  ) {

    if (locked) {
      return;
    }

    setLocked(
      true
    );

    try {

      const result =
        await scanTruckItem({
          scanValue:
            data,

          scanType:
            "TRUCK_DRIVER_SCAN"
        });

      Alert.alert(
        "Scan successful",

        JSON.stringify(
          result
        ),

        [
          {
            text:
              "Scan another",

            onPress:
              () =>
                setLocked(false)
          }
        ]
      );

    } catch (
      error:
        any
    ) {

      Alert.alert(
        "Scan failed",

        error?.response?.data?.message ??
        error?.message ??
        "Unable to process scan.",

        [
          {
            text:
              "Try again",

            onPress:
              () =>
                setLocked(false)
          }
        ]
      );
    }
  }

  return (
    <View style={styles.screen}>

      <CameraView
        style={
          StyleSheet.absoluteFill
        }

        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "code128",
            "code39",
            "ean13"
          ]
        }}

        onBarcodeScanned={
          locked
            ? undefined
            : ({
                data
              }) =>
                scanned(data)
        }
      />

      <View style={styles.overlay}>

        <Pressable
          style={styles.back}

          onPress={() =>
            router.back()
          }
        >
          <Text style={styles.backText}>
            ← Back
          </Text>
        </Pressable>

        <View>

          <Text style={styles.title}>
            Scan Manifest / Bag
          </Text>

          <Text style={styles.subtitle}>
            Align the barcode inside the frame.
          </Text>

        </View>

        <View style={styles.frame} />

        <Text style={styles.help}>
          Gogate Products Truck Driver
        </Text>

      </View>

    </View>
  );
}

const styles =
  StyleSheet.create({

    screen: {
      flex: 1,

      backgroundColor:
        "#000000"
    },

    overlay: {
      flex: 1,

      padding: 22,

      paddingTop: 55,

      paddingBottom: 40,

      justifyContent:
        "space-between",

      backgroundColor:
        "rgba(15,23,42,.3)"
    },

    back: {
      alignSelf:
        "flex-start",

      paddingHorizontal: 15,

      paddingVertical: 10,

      borderRadius: 14,

      backgroundColor:
        "rgba(255,255,255,.95)"
    },

    backText: {
      fontWeight: "900",

      color:
        colors.primary
    },

    title: {
      fontSize: 29,

      fontWeight: "900",

      color: "#ffffff"
    },

    subtitle: {
      marginTop: 6,

      color:
        "#e2e8f0"
    },

    frame: {
      alignSelf: "center",

      width: "83%",

      aspectRatio: 1,

      borderWidth: 3,

      borderColor:
        "#ffffff",

      borderRadius: 28
    },

    help: {
      textAlign: "center",

      fontSize: 12,

      fontWeight: "800",

      color: "#ffffff"
    },

    center: {
      flex: 1,

      alignItems: "center",

      justifyContent: "center",

      padding: 25,

      backgroundColor:
        colors.background
    },

    permissionTitle: {
      fontSize: 22,

      fontWeight: "900",

      color:
        colors.text
    },

    permissionButton: {
      marginTop: 20,

      paddingHorizontal: 25,

      paddingVertical: 15,

      borderRadius: 16,

      backgroundColor:
        colors.primary
    },

    permissionButtonText: {
      color: "#ffffff",

      fontWeight: "900"
    }
  });