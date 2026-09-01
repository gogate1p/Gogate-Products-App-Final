import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";

import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";

import {
  useState,
} from "react";

import {
  router,
} from "expo-router";

import {
  colors,
} from "../src/theme";

import {
  scanPackage,
} from "../src/shipments";

export default function ScanScreen() {
  const [
    permission,
    requestPermission,
  ] =
    useCameraPermissions();

  const [
    locked,
    setLocked,
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
        <Text style={styles.heading}>
          Camera Permission
        </Text>

        <Text style={styles.description}>
          Camera access is needed to scan shipment barcodes.
        </Text>

        <Pressable
          onPress={requestPermission}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Allow Camera
          </Text>
        </Pressable>
      </View>
    );
  }

  async function scanned(
    data:
      string,
  ) {
    if (locked) {
      return;
    }

    setLocked(true);

    try {
      const result =
        await scanPackage({
          scanValue:
            data,

          scanType:
            "RIDER_SCAN",
        });

      Alert.alert(
        "Scan successful",
        JSON.stringify(result),
        [
          {
            text:
              "Scan another",

            onPress:
              () =>
                setLocked(false),
          },
        ],
      );
    } catch (
      error:
        any
    ) {
      Alert.alert(
        "Scan failed",
        error?.response?.data?.message ??
        error?.message ??
        "Unable to scan package",
        [
          {
            text:
              "Try again",

            onPress:
              () =>
                setLocked(false),
          },
        ],
      );
    }
  }

  return (
    <View style={styles.screen}>

      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: [
            "qr",
            "code128",
            "code39",
            "ean13",
            "ean8",
          ],
        }}
        onBarcodeScanned={
          locked
            ? undefined
            : ({
                data,
              }) =>
                scanned(
                  data,
                )
        }
      />

      <View style={styles.overlay}>

        <View style={styles.top}>

          <Pressable
            onPress={
              () =>
                router.back()
            }
            style={styles.back}
          >
            <Text style={styles.backText}>
              â† Back
            </Text>
          </Pressable>

          <Text style={styles.title}>
            Scan Package
          </Text>

          <Text style={styles.subtitle}>
            Place the barcode inside the frame.
          </Text>

        </View>

        <View style={styles.frame} />

        <View style={styles.bottom}>

          <Text style={styles.hint}>
            Camera scanning is connected to the Gogate package scan API.
          </Text>

        </View>

      </View>

    </View>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex:
        1,
      backgroundColor:
        "#000000",
    },

    overlay: {
      flex:
        1,
      justifyContent:
        "space-between",
      padding:
        22,
      backgroundColor:
        "rgba(15,23,42,.28)",
    },

    top: {
      paddingTop:
        50,
    },

    back: {
      alignSelf:
        "flex-start",
      borderRadius:
        14,
      paddingHorizontal:
        14,
      paddingVertical:
        10,
      backgroundColor:
        "rgba(255,255,255,.94)",
    },

    backText: {
      color:
        colors.primary,
      fontWeight:
        "900",
    },

    title: {
      marginTop:
        26,
      fontSize:
        29,
      fontWeight:
        "900",
      color:
        "#ffffff",
    },

    subtitle: {
      marginTop:
        7,
      color:
        "#e2e8f0",
      fontSize:
        14,
    },

    frame: {
      alignSelf:
        "center",
      width:
        "82%",
      aspectRatio:
        1,
      borderWidth:
        3,
      borderColor:
        "#ffffff",
      borderRadius:
        28,
    },

    bottom: {
      paddingBottom:
        35,
    },

    hint: {
      textAlign:
        "center",
      color:
        "#ffffff",
      fontWeight:
        "700",
    },

    center: {
      flex:
        1,
      padding:
        30,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        colors.background,
    },

    heading: {
      fontSize:
        26,
      fontWeight:
        "900",
      color:
        colors.text,
    },

    description: {
      marginTop:
        10,
      textAlign:
        "center",
      lineHeight:
        22,
      color:
        colors.textMuted,
    },

    button: {
      marginTop:
        24,
      paddingHorizontal:
        28,
      paddingVertical:
        16,
      borderRadius:
        16,
      backgroundColor:
        colors.primary,
    },

    buttonText: {
      color:
        "#ffffff",
      fontWeight:
        "900",
    },
  });