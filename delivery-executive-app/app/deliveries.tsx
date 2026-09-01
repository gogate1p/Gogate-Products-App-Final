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
        My Deliveries
      </Text>

      <Text style={styles.text}>
        Assigned deliveries, route sequence, customer details, OTP and proof-of-delivery workflow will be built here.
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