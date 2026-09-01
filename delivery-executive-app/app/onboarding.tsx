import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import {
  colors,
} from "../src/theme";

export default function Page() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>
        Onboarding & KYC
      </Text>

      <Text style={styles.text}>
        Hub selection, KYC documents, verification status, activation PIN, vehicle and welcome-kit flows will be managed here.
      </Text>
    </View>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex:
        1,
      padding:
        24,
      paddingTop:
        80,
      backgroundColor:
        colors.background,
    },

    title: {
      fontSize:
        30,
      fontWeight:
        "900",
      color:
        colors.text,
    },

    text: {
      marginTop:
        12,
      fontSize:
        15,
      lineHeight:
        23,
      color:
        colors.textMuted,
    },
  });