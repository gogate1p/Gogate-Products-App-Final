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
        My Profile
      </Text>

      <Text style={styles.text}>
        Delivery executive profile, rider code, hub, vehicle, status, settings and logout.
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