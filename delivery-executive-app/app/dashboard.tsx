import {
  Animated,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
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
  Bell,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  Clock3,
  MapPin,
  Navigation,
  PackageCheck,
  Route,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react-native";

import {
  colors,
  shadows,
} from "../src/theme";

import {
  riderDashboard,
  riderStatus,
} from "../src/workforce";

export default function Dashboard() {
  const [dashboard, setDashboard] =
    useState<any>(null);

  const [status, setStatus] =
    useState<any>(null);

  const [refreshing, setRefreshing] =
    useState(false);

  const fade =
    useRef(
      new Animated.Value(0),
    ).current;

  const rise =
    useRef(
      new Animated.Value(20),
    ).current;

  async function load() {
    try {
      const [
        dash,
        state,
      ] =
        await Promise.all([
          riderDashboard(),
          riderStatus(),
        ]);

      setDashboard(
        dash,
      );

      setStatus(
        state,
      );
    } catch {}
  }

  useEffect(() => {
    load();

    Animated.parallel([
      Animated.timing(
        fade,
        {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        },
      ),

      Animated.spring(
        rise,
        {
          toValue: 0,
          damping: 18,
          stiffness: 130,
          useNativeDriver: true,
        },
      ),
    ]).start();
  }, []);

  async function refresh() {
    Haptics.selectionAsync();

    setRefreshing(
      true,
    );

    await load();

    setRefreshing(
      false,
    );
  }

  function go(
    path:
      string,
  ) {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Light,
    );

    router.push(
      path as any,
    );
  }

  const assigned =
    dashboard?.assigned ??
    dashboard?.assignedDeliveries ??
    0;

  const completed =
    dashboard?.completed ??
    dashboard?.completedDeliveries ??
    0;

  const pending =
    dashboard?.pending ??
    dashboard?.pendingDeliveries ??
    0;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
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

      <View style={styles.topBar}>

        <View>

          <Text style={styles.eyebrow}>
            GOGATE PRODUCTS
          </Text>

          <Text style={styles.greeting}>
            Good day ðŸ‘‹
          </Text>

          <Text style={styles.subGreeting}>
            Ready for today's deliveries?
          </Text>

        </View>

        <View style={styles.topActions}>

          <Pressable style={styles.circleButton}>
            <Bell
              size={21}
              color={colors.textSecondary}
            />

            <View style={styles.notificationDot} />
          </Pressable>

          <Pressable
            onPress={() =>
              go(
                "/profile",
              )
            }
            style={styles.profileButton}
          >
            <CircleUserRound
              size={24}
              color={colors.primary}
            />
          </Pressable>

        </View>

      </View>

      <Animated.View
        style={{
          opacity:
            fade,

          transform: [
            {
              translateY:
                rise,
            },
          ],
        }}
      >

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
          style={styles.shiftCard}
        >

          <View style={styles.shiftDecorationOne} />
          <View style={styles.shiftDecorationTwo} />

          <View style={styles.shiftTop}>

            <View>

              <Text style={styles.shiftLabel}>
                SHIFT STATUS
              </Text>

              <Text style={styles.shiftStatus}>
                {
                  status?.status ??
                  status?.riderState ??
                  "Ready"
                }
              </Text>

            </View>

            <View style={styles.liveChip}>
              <View style={styles.liveDot} />

              <Text style={styles.liveText}>
                LIVE
              </Text>
            </View>

          </View>

          <View style={styles.shiftStats}>

            <View>
              <Text style={styles.shiftStatValue}>
                {assigned}
              </Text>

              <Text style={styles.shiftStatLabel}>
                Assigned
              </Text>
            </View>

            <View style={styles.shiftDivider} />

            <View>
              <Text style={styles.shiftStatValue}>
                {completed}
              </Text>

              <Text style={styles.shiftStatLabel}>
                Delivered
              </Text>
            </View>

            <View style={styles.shiftDivider} />

            <View>
              <Text style={styles.shiftStatValue}>
                {pending}
              </Text>

              <Text style={styles.shiftStatLabel}>
                Pending
              </Text>
            </View>

          </View>

        </LinearGradient>

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Quick actions
          </Text>

          <Text style={styles.sectionHint}>
            Delivery tools
          </Text>

        </View>

        <View style={styles.actionGrid}>

          <ActionCard
            icon={ScanLine}
            title="Scan"
            subtitle="Package barcode"
            color={colors.primary}
            background={colors.primarySoft}
            onPress={() =>
              go(
                "/scan",
              )
            }
          />

          <ActionCard
            icon={Navigation}
            title="Deliveries"
            subtitle="Today's stops"
            color={colors.successDark}
            background={colors.successSoft}
            onPress={() =>
              go(
                "/deliveries",
              )
            }
          />

          <ActionCard
            icon={MapPin}
            title="Check In"
            subtitle="Hub attendance"
            color={colors.warning}
            background={colors.warningSoft}
            onPress={() =>
              go(
                "/check-in",
              )
            }
          />

          <ActionCard
            icon={CalendarDays}
            title="Schedule"
            subtitle="Slots & shifts"
            color={colors.purple}
            background={colors.purpleSoft}
            onPress={() =>
              go(
                "/schedule",
              )
            }
          />

        </View>

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Today's progress
          </Text>

          <TrendingUp
            size={18}
            color={colors.success}
          />

        </View>

        <View style={styles.progressCard}>

          <View style={styles.progressHeader}>

            <View>

              <Text style={styles.progressTitle}>
                Delivery completion
              </Text>

              <Text style={styles.progressSubtitle}>
                Keep going â€” you're doing well.
              </Text>

            </View>

            <Text style={styles.progressPercent}>
              {
                assigned > 0
                  ? Math.round(
                      completed /
                      assigned *
                      100,
                    )
                  : 0
              }%
            </Text>

          </View>

          <View style={styles.progressTrack}>

            <View
              style={[
                styles.progressBar,
                {
                  width:
                    `${
                      assigned > 0
                        ? Math.min(
                            100,
                            completed /
                            assigned *
                            100,
                          )
                        : 0
                    }%`,
                },
              ]}
            />

          </View>

        </View>

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            My workspace
          </Text>

        </View>

        <WorkspaceRow
          icon={Route}
          title="Route & Runsheet"
          subtitle="Optimized delivery sequence"
          onPress={() =>
            go(
              "/deliveries",
            )
          }
        />

        <WorkspaceRow
          icon={Clock3}
          title="Shift Status"
          subtitle="Attendance and working hours"
          onPress={() =>
            go(
              "/shift",
            )
          }
        />

        <WorkspaceRow
          icon={WalletCards}
          title="Earnings"
          subtitle="Daily payout summary"
          onPress={() =>
            Haptics.selectionAsync()
          }
        />

        <WorkspaceRow
          icon={ShieldCheck}
          title="KYC & Activation"
          subtitle="Documents and rider verification"
          onPress={() =>
            go(
              "/onboarding",
            )
          }
        />

        <View style={styles.tipCard}>

          <View style={styles.tipIcon}>
            <Sparkles
              size={19}
              color={colors.primary}
            />
          </View>

          <View style={styles.tipContent}>

            <Text style={styles.tipTitle}>
              Delivery tip
            </Text>

            <Text style={styles.tipText}>
              Scan every package before leaving the hub to prevent delivery exceptions.
            </Text>

          </View>

        </View>

      </Animated.View>

    </ScrollView>
  );
}

function ActionCard({
  icon: Icon,
  title,
  subtitle,
  color,
  background,
  onPress,
}: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionCard,
        pressed && {
          transform: [
            {
              scale:
                .97,
            },
          ],
        },
      ]}
    >

      <View
        style={[
          styles.actionIcon,
          {
            backgroundColor:
              background,
          },
        ]}
      >
        <Icon
          size={22}
          color={color}
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

function WorkspaceRow({
  icon: Icon,
  title,
  subtitle,
  onPress,
}: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.workspaceRow,
        pressed && {
          opacity:
            .75,
        },
      ]}
    >

      <View style={styles.workspaceIcon}>
        <Icon
          size={20}
          color={colors.primary}
        />
      </View>

      <View style={styles.workspaceContent}>

        <Text style={styles.workspaceTitle}>
          {title}
        </Text>

        <Text style={styles.workspaceSubtitle}>
          {subtitle}
        </Text>

      </View>

      <ChevronRight
        size={20}
        color={colors.textSoft}
      />

    </Pressable>
  );
}

const styles =
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    content: {
      paddingHorizontal: 19,
      paddingTop: 56,
      paddingBottom: 45,
    },

    topBar: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
    },

    eyebrow: {
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.5,
      color: colors.primary,
    },

    greeting: {
      marginTop: 4,
      fontSize: 26,
      fontWeight: "900",
      color: colors.text,
    },

    subGreeting: {
      marginTop: 3,
      fontSize: 12,
      color:
        colors.textMuted,
    },

    topActions: {
      flexDirection:
        "row",
      gap: 9,
    },

    circleButton: {
      width: 44,
      height: 44,
      borderRadius: 15,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        colors.surface,
      borderWidth: 1,
      borderColor:
        colors.border,
    },

    notificationDot: {
      position:
        "absolute",
      right: 10,
      top: 9,
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor:
        colors.danger,
      borderWidth: 1,
      borderColor:
        "#ffffff",
    },

    profileButton: {
      width: 44,
      height: 44,
      borderRadius: 15,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        colors.primarySoft,
    },

    shiftCard: {
      marginTop: 25,
      borderRadius: 27,
      padding: 21,
      overflow: "hidden",
      ...shadows.primary,
    },

    shiftDecorationOne: {
      position: "absolute",
      width: 150,
      height: 150,
      right: -60,
      top: -65,
      borderRadius: 75,
      backgroundColor:
        "rgba(255,255,255,.09)",
    },

    shiftDecorationTwo: {
      position: "absolute",
      width: 80,
      height: 80,
      left: -35,
      bottom: -40,
      borderRadius: 40,
      backgroundColor:
        "rgba(255,255,255,.07)",
    },

    shiftTop: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems: "center",
    },

    shiftLabel: {
      fontSize: 10,
      fontWeight: "900",
      letterSpacing: 1.5,
      color:
        "rgba(255,255,255,.7)",
    },

    shiftStatus: {
      marginTop: 5,
      fontSize: 22,
      fontWeight: "900",
      color: "#ffffff",
      textTransform:
        "capitalize",
    },

    liveChip: {
      flexDirection:
        "row",
      alignItems:
        "center",
      gap: 6,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 7,
      backgroundColor:
        "rgba(255,255,255,.15)",
    },

    liveDot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor:
        "#a7f3d0",
    },

    liveText: {
      color: "#ffffff",
      fontSize: 9,
      fontWeight: "900",
    },

    shiftStats: {
      marginTop: 28,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
    },

    shiftStatValue: {
      fontSize: 23,
      fontWeight: "900",
      color: "#ffffff",
      textAlign: "center",
    },

    shiftStatLabel: {
      marginTop: 3,
      fontSize: 10,
      fontWeight: "700",
      color:
        "rgba(255,255,255,.72)",
    },

    shiftDivider: {
      width: 1,
      height: 32,
      backgroundColor:
        "rgba(255,255,255,.2)",
    },

    sectionHeader: {
      marginTop: 28,
      marginBottom: 12,
      flexDirection:
        "row",
      alignItems:
        "center",
      justifyContent:
        "space-between",
    },

    sectionTitle: {
      fontSize: 17,
      fontWeight: "900",
      color: colors.text,
    },

    sectionHint: {
      fontSize: 10,
      fontWeight: "700",
      color:
        colors.textMuted,
    },

    actionGrid: {
      flexDirection:
        "row",
      flexWrap:
        "wrap",
      justifyContent:
        "space-between",
      gap: 12,
    },

    actionCard: {
      width: "48%",
      minHeight: 130,
      borderRadius: 21,
      padding: 16,
      backgroundColor:
        colors.surface,
      borderWidth: 1,
      borderColor:
        colors.border,
      ...shadows.card,
    },

    actionIcon: {
      width: 44,
      height: 44,
      borderRadius: 15,
      alignItems:
        "center",
      justifyContent:
        "center",
    },

    actionTitle: {
      marginTop: 15,
      fontSize: 14,
      fontWeight: "900",
      color: colors.text,
    },

    actionSubtitle: {
      marginTop: 3,
      fontSize: 10,
      color:
        colors.textMuted,
    },

    progressCard: {
      padding: 18,
      borderRadius: 21,
      backgroundColor:
        colors.surface,
      borderWidth: 1,
      borderColor:
        colors.border,
      ...shadows.card,
    },

    progressHeader: {
      flexDirection: "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
    },

    progressTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.text,
    },

    progressSubtitle: {
      marginTop: 4,
      fontSize: 10,
      color:
        colors.textMuted,
    },

    progressPercent: {
      fontSize: 22,
      fontWeight: "900",
      color:
        colors.successDark,
    },

    progressTrack: {
      marginTop: 16,
      height: 8,
      borderRadius: 999,
      overflow: "hidden",
      backgroundColor:
        "#e2e8f0",
    },

    progressBar: {
      height: "100%",
      borderRadius: 999,
      backgroundColor:
        colors.success,
    },

    workspaceRow: {
      marginBottom: 10,
      minHeight: 74,
      paddingHorizontal: 15,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor:
        colors.surface,
      borderWidth: 1,
      borderColor:
        colors.border,
    },

    workspaceIcon: {
      width: 43,
      height: 43,
      borderRadius: 14,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        colors.primarySoft,
    },

    workspaceContent: {
      flex: 1,
      marginLeft: 13,
    },

    workspaceTitle: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.text,
    },

    workspaceSubtitle: {
      marginTop: 3,
      fontSize: 10,
      color:
        colors.textMuted,
    },

    tipCard: {
      marginTop: 18,
      padding: 17,
      borderRadius: 20,
      flexDirection: "row",
      backgroundColor:
        colors.primarySoft,
      borderWidth: 1,
      borderColor:
        "#bae6fd",
    },

    tipIcon: {
      width: 40,
      height: 40,
      borderRadius: 13,
      alignItems:
        "center",
      justifyContent:
        "center",
      backgroundColor:
        colors.surface,
    },

    tipContent: {
      flex: 1,
      marginLeft: 12,
    },

    tipTitle: {
      fontSize: 12,
      fontWeight: "900",
      color: colors.text,
    },

    tipText: {
      marginTop: 4,
      fontSize: 10,
      lineHeight: 16,
      color:
        colors.textMuted,
    },
  });