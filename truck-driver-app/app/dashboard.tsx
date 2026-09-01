import {
  Pressable,
  RefreshControl,
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
  router
} from "expo-router";

import {
  LinearGradient
} from "expo-linear-gradient";

import * as Haptics from "expo-haptics";

import {
  Bell,
  ChevronRight,
  CircleUserRound,
  Fuel,
  MapPin,
  Navigation,
  PackageSearch,
  Route,
  ScanLine,
  Truck
} from "lucide-react-native";

import {
  colors
} from "../src/theme";

import {
  truckDashboard,
  truckVehicle
} from "../src/truck-driver";

export default function Dashboard() {

  const [
    dashboard,
    setDashboard
  ] =
    useState<any>(null);

  const [
    vehicle,
    setVehicle
  ] =
    useState<any>(null);

  const [
    refreshing,
    setRefreshing
  ] =
    useState(false);

  async function load() {

    try {

      const [
        dash,
        truck
      ] =
        await Promise.all([
          truckDashboard(),
          truckVehicle()
        ]);

      setDashboard(
        dash
      );

      setVehicle(
        truck
      );

    } catch {}
  }

  useEffect(
    () => {
      load();
    },
    []
  );

  async function refresh() {

    setRefreshing(
      true
    );

    await load();

    setRefreshing(
      false
    );
  }

  function go(
    path: string
  ) {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light
    );

    router.push(
      path as any
    );
  }

  return (
    <ScrollView
      style={styles.screen}

      contentContainerStyle={
        styles.content
      }

      showsVerticalScrollIndicator={
        false
      }

      refreshControl={
        <RefreshControl
          refreshing={
            refreshing
          }

          onRefresh={
            refresh
          }

          tintColor={
            colors.primary
          }
        />
      }
    >

      <View style={styles.header}>

        <View>

          <Text style={styles.brand}>
            GOGATE PRODUCTS
          </Text>

          <Text style={styles.heading}>
            Truck Driver
          </Text>

          <Text style={styles.subheading}>
            Line-haul operations
          </Text>

        </View>

        <View style={styles.headerButtons}>

          <Pressable style={styles.iconButton}>
            <Bell
              size={21}
              color={colors.textSecondary}
            />
          </Pressable>

          <Pressable
            style={styles.profileButton}

            onPress={() =>
              go(
                "/profile"
              )
            }
          >
            <CircleUserRound
              size={24}
              color={colors.primary}
            />
          </Pressable>

        </View>

      </View>

      <LinearGradient
        colors={[
          "#0284c7",
          "#0891b2",
          "#10b981"
        ]}

        style={styles.tripCard}
      >

        <Text style={styles.cardLabel}>
          ACTIVE ASSIGNMENT
        </Text>

        <Text style={styles.cardTitle}>
          {
            dashboard?.activeManifest
              ? "Trip in progress"
              : "Ready for assignment"
          }
        </Text>

        <View style={styles.tripMeta}>

          <View>

            <Text style={styles.tripValue}>
              {
                dashboard?.assigned ??
                0
              }
            </Text>

            <Text style={styles.tripLabel}>
              Assigned
            </Text>

          </View>

          <View style={styles.divider} />

          <View>

            <Text style={styles.tripValue}>
              {
                dashboard?.inTransit ??
                0
              }
            </Text>

            <Text style={styles.tripLabel}>
              In Transit
            </Text>

          </View>

          <View style={styles.divider} />

          <View>

            <Text style={styles.tripValue}>
              {
                dashboard?.completed ??
                0
              }
            </Text>

            <Text style={styles.tripLabel}>
              Completed
            </Text>

          </View>

        </View>

      </LinearGradient>

      <Text style={styles.sectionTitle}>
        Quick actions
      </Text>

      <View style={styles.grid}>

        <Action
          icon={Route}

          title="Trips"

          subtitle="Assigned manifests"

          onPress={() =>
            go(
              "/trips"
            )
          }
        />

        <Action
          icon={ScanLine}

          title="Scan"

          subtitle="Manifest / bag"

          onPress={() =>
            go(
              "/scan"
            )
          }
        />

        <Action
          icon={Navigation}

          title="Navigation"

          subtitle="Trip destination"

          onPress={() =>
            go(
              "/trips"
            )
          }
        />

        <Action
          icon={Truck}

          title="Vehicle"

          subtitle="Truck information"

          onPress={() =>
            go(
              "/vehicle"
            )
          }
        />

      </View>

      <Text style={styles.sectionTitle}>
        Assigned vehicle
      </Text>

      <View style={styles.vehicleCard}>

        <View style={styles.vehicleIcon}>

          <Truck
            size={26}
            color={colors.primary}
          />

        </View>

        <View style={styles.vehicleContent}>

          <Text style={styles.vehicleTitle}>
            {
              vehicle?.registration ??
              vehicle?.vehicle?.registration ??
              "No truck assigned"
            }
          </Text>

          <Text style={styles.vehicleSubtitle}>
            {
              vehicle?.make ??
              vehicle?.vehicle?.make ??
              ""
            }
            {" "}
            {
              vehicle?.model ??
              vehicle?.vehicle?.model ??
              ""
            }
          </Text>

        </View>

        <ChevronRight
          size={20}
          color={colors.soft}
        />

      </View>

      <Text style={styles.sectionTitle}>
        Driver tools
      </Text>

      <DriverTool
        icon={MapPin}

        title="Live Location"

        subtitle="Share GPS while trip is active"

        onPress={() =>
          go(
            "/location"
          )
        }
      />

      <DriverTool
        icon={Fuel}

        title="Fuel & Expenses"

        subtitle="Trip expense records"

        onPress={() =>
          go(
            "/expenses"
          )
        }
      />

      <DriverTool
        icon={PackageSearch}

        title="Manifest Items"

        subtitle="Packages and bags assigned to truck"

        onPress={() =>
          go(
            "/trips"
          )
        }
      />

    </ScrollView>
  );
}

function Action({
  icon: Icon,
  title,
  subtitle,
  onPress
}: any) {

  return (
    <Pressable
      style={styles.action}

      onPress={
        onPress
      }
    >

      <View style={styles.actionIcon}>
        <Icon
          size={22}
          color={colors.primary}
        />
      </View>

      <Text style={styles.actionTitle}>
        {title}
      </Text>

      <Text style={styles.actionSubtitle}>
        {subtitle}
      </Text>

    </Pressable>
  );
}

function DriverTool({
  icon: Icon,
  title,
  subtitle,
  onPress
}: any) {

  return (
    <Pressable
      style={styles.tool}

      onPress={
        onPress
      }
    >

      <View style={styles.toolIcon}>

        <Icon
          size={20}
          color={colors.primary}
        />

      </View>

      <View style={styles.toolContent}>

        <Text style={styles.toolTitle}>
          {title}
        </Text>

        <Text style={styles.toolSubtitle}>
          {subtitle}
        </Text>

      </View>

      <ChevronRight
        size={20}
        color={colors.soft}
      />

    </Pressable>
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
      paddingHorizontal: 19,

      paddingTop: 56,

      paddingBottom: 45
    },

    header: {
      flexDirection: "row",

      alignItems: "center",

      justifyContent:
        "space-between"
    },

    brand: {
      fontSize: 10,

      fontWeight: "900",

      letterSpacing: 1.6,

      color:
        colors.primary
    },

    heading: {
      marginTop: 4,

      fontSize: 27,

      fontWeight: "900",

      color:
        colors.text
    },

    subheading: {
      marginTop: 3,

      fontSize: 11,

      color:
        colors.muted
    },

    headerButtons: {
      flexDirection: "row",

      gap: 8
    },

    iconButton: {
      width: 44,

      height: 44,

      borderRadius: 15,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border
    },

    profileButton: {
      width: 44,

      height: 44,

      borderRadius: 15,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        colors.primarySoft
    },

    tripCard: {
      marginTop: 25,

      borderRadius: 27,

      padding: 21
    },

    cardLabel: {
      fontSize: 10,

      fontWeight: "900",

      letterSpacing: 1.4,

      color:
        "rgba(255,255,255,.72)"
    },

    cardTitle: {
      marginTop: 6,

      fontSize: 22,

      fontWeight: "900",

      color: "#ffffff"
    },

    tripMeta: {
      marginTop: 28,

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems: "center"
    },

    tripValue: {
      fontSize: 23,

      fontWeight: "900",

      color: "#ffffff",

      textAlign: "center"
    },

    tripLabel: {
      marginTop: 3,

      fontSize: 10,

      color:
        "rgba(255,255,255,.75)"
    },

    divider: {
      width: 1,

      height: 32,

      backgroundColor:
        "rgba(255,255,255,.2)"
    },

    sectionTitle: {
      marginTop: 28,

      marginBottom: 12,

      fontSize: 17,

      fontWeight: "900",

      color:
        colors.text
    },

    grid: {
      flexDirection: "row",

      flexWrap: "wrap",

      justifyContent:
        "space-between",

      gap: 12
    },

    action: {
      width: "48%",

      minHeight: 127,

      padding: 16,

      borderRadius: 21,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border
    },

    actionIcon: {
      width: 44,

      height: 44,

      borderRadius: 15,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        colors.primarySoft
    },

    actionTitle: {
      marginTop: 15,

      fontSize: 14,

      fontWeight: "900",

      color:
        colors.text
    },

    actionSubtitle: {
      marginTop: 3,

      fontSize: 10,

      color:
        colors.muted
    },

    vehicleCard: {
      minHeight: 80,

      paddingHorizontal: 15,

      flexDirection: "row",

      alignItems: "center",

      borderRadius: 21,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border
    },

    vehicleIcon: {
      width: 48,

      height: 48,

      borderRadius: 16,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        colors.primarySoft
    },

    vehicleContent: {
      flex: 1,

      marginLeft: 13
    },

    vehicleTitle: {
      fontSize: 15,

      fontWeight: "900",

      color:
        colors.text
    },

    vehicleSubtitle: {
      marginTop: 3,

      fontSize: 11,

      color:
        colors.muted
    },

    tool: {
      minHeight: 72,

      marginBottom: 10,

      paddingHorizontal: 14,

      flexDirection: "row",

      alignItems: "center",

      borderRadius: 20,

      backgroundColor:
        colors.surface,

      borderWidth: 1,

      borderColor:
        colors.border
    },

    toolIcon: {
      width: 42,

      height: 42,

      borderRadius: 14,

      alignItems: "center",

      justifyContent: "center",

      backgroundColor:
        colors.primarySoft
    },

    toolContent: {
      flex: 1,

      marginLeft: 13
    },

    toolTitle: {
      fontSize: 13,

      fontWeight: "900",

      color:
        colors.text
    },

    toolSubtitle: {
      marginTop: 3,

      fontSize: 10,

      color:
        colors.muted
    }
  });