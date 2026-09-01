import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import {
  useEffect,
  useState
} from "react";

import {
  Route,
  MapPin,
  ChevronRight
} from "lucide-react-native";

import {
  colors
} from "../src/theme";

import {
  assignedManifests
} from "../src/truck-driver";

export default function Trips() {

  const [
    manifests,
    setManifests
  ] =
    useState<any[]>([]);

  const [
    loading,
    setLoading
  ] =
    useState(true);

  useEffect(
    () => {

      assignedManifests()
        .then(
          response => {

            setManifests(
              Array.isArray(response)
                ? response
                : response?.data ?? []
            );

          }
        )
        .finally(
          () =>
            setLoading(false)
        );

    },
    []
  );

  return (
    <ScrollView
      style={styles.screen}

      contentContainerStyle={
        styles.content
      }
    >

      <Text style={styles.brand}>
        GOGATE PRODUCTS
      </Text>

      <Text style={styles.title}>
        My Trips
      </Text>

      <Text style={styles.subtitle}>
        Assigned line-haul manifests and hub transfers.
      </Text>

      {loading && (
        <ActivityIndicator
          color={colors.primary}

          style={{
            marginTop: 40
          }}
        />
      )}

      {!loading &&
       manifests.length === 0 && (

        <View style={styles.empty}>

          <Route
            size={40}
            color={colors.primary}
          />

          <Text style={styles.emptyTitle}>
            No active assignments
          </Text>

          <Text style={styles.emptyText}>
            New truck manifests will appear here when dispatch assigns them.
          </Text>

        </View>
      )}

      {manifests.map(
        manifest => (

          <Pressable
            key={manifest.id}

            style={styles.card}
          >

            <View style={styles.cardIcon}>

              <Route
                size={23}
                color={colors.primary}
              />

            </View>

            <View style={styles.cardContent}>

              <Text style={styles.cardTitle}>
                {
                  manifest.manifestNumber ??
                  manifest.id
                }
              </Text>

              <Text style={styles.cardStatus}>
                {
                  manifest.status ??
                  "ASSIGNED"
                }
              </Text>

              <View style={styles.routeRow}>

                <MapPin
                  size={13}
                  color={colors.muted}
                />

                <Text style={styles.routeText}>
                  {
                    manifest.originHub?.name ??
                    "Origin Hub"
                  }
                  {" → "}
                  {
                    manifest.destinationHub?.name ??
                    "Destination Hub"
                  }
                </Text>

              </View>

            </View>

            <ChevronRight
              size={20}
              color={colors.soft}
            />

          </Pressable>
        )
      )}

    </ScrollView>
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
      padding: 21,

      paddingTop: 60,

      paddingBottom: 40
    },

    brand: {
      fontSize: 10,

      fontWeight: "900",

      letterSpacing: 1.6,

      color:
        colors.primary
    },

    title: {
      marginTop: 5,

      fontSize: 30,

      fontWeight: "900",

      color:
        colors.text
    },

    subtitle: {
      marginTop: 7,

      fontSize: 13,

      color:
        colors.muted
    },

    empty: {
      marginTop: 40,

      padding: 35,

      alignItems: "center",

      borderRadius: 24,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border
    },

    emptyTitle: {
      marginTop: 17,

      fontSize: 16,

      fontWeight: "900",

      color:
        colors.text
    },

    emptyText: {
      marginTop: 7,

      textAlign: "center",

      lineHeight: 19,

      fontSize: 12,

      color:
        colors.muted
    },

    card: {
      marginTop: 15,

      minHeight: 100,

      padding: 15,

      flexDirection: "row",

      alignItems: "center",

      borderRadius: 22,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border
    },

    cardIcon: {
      width: 48,

      height: 48,

      borderRadius: 16,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        colors.primarySoft
    },

    cardContent: {
      flex: 1,

      marginLeft: 13
    },

    cardTitle: {
      fontSize: 14,

      fontWeight: "900",

      color:
        colors.text
    },

    cardStatus: {
      marginTop: 3,

      fontSize: 10,

      fontWeight: "800",

      color:
        colors.successDark
    },

    routeRow: {
      marginTop: 8,

      flexDirection: "row",

      gap: 5,

      alignItems: "center"
    },

    routeText: {
      fontSize: 10,

      color:
        colors.muted
    }
  });