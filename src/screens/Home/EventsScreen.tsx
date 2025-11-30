import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseContainer } from '../../components/BaseContainer';
import CustomText from '../../components/CustomText';
import { HomeTabParamList } from '../../navigation/HomeTabsNavigator';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<HomeTabParamList, 'Events'>;

type EventItem = {
  id: string;
  titleLine1: string;
  titleLine2?: string;
  priceText: string;
  orderId: string;
  status: 'Booked' | 'Pending' | 'Completed';
  imageUrl: string;
  steps: number;
  completedSteps: number; // 0..steps
};

const EventsScreen: React.FC<Props> = ({ navigation }) => {
  const COLORS = useMemo(
    () => ({
      primary: '#305B77', // close to screenshot
      textPrimary: '#1F2A33',
      textMuted: '#6B7280',
      border: '#E7E7E7',
      cardBg: '#FFFFFF',
      chipBg: '#E6E6E6',
      bg: '#FFFFFF',
      ring: '#F2E7C8',
      line: '#CFCFCF',
    }),
    []
  );

  const demoEvent: EventItem = {
    id: '265894',
    titleLine1: 'South Indian',
    titleLine2: 'Style Wedding',
    priceText: '₹ 75,000,00.00',
    orderId: '#265894',
    status: 'Booked',
    imageUrl:
      'https://images.unsplash.com/photo-1523438097201-512ae7d59c10?auto=format&fit=crop&w=400&q=80',
    steps: 4,
    completedSteps: 3, // first 3 filled, last grey like screenshot
  };

  const onPressBookEvents = () => {
    navigation.navigate('BookEventFlow');
  };

  const onPressTrackStatus = () => {
    // navigation.navigate("EventStatus" as never, { orderId: demoEvent.orderId } as never);
  };

  return (
    <BaseContainer>
      <ScreenHeader
        title="Events"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { backgroundColor: COLORS.bg }]}
      >
        {/* Section 1 */}
        <View style={styles.section}>
          <CustomText style={[styles.h1, { color: COLORS.primary }]}>
            Your Event Starts Here
          </CustomText>
          <CustomText style={[styles.sub, { color: COLORS.textMuted }]}>
            Plan, book, and celebrate effortlessly.
          </CustomText>

          <PrimaryButton
            label="Book Events"
            onPress={onPressBookEvents}
            background={COLORS.primary}
          />
        </View>

        {/* Section 2 */}
        <View style={[styles.section, { marginTop: 26 }]}>
          <CustomText style={[styles.h1, { color: COLORS.primary }]}>
            Your Events, the Nuvo Way
          </CustomText>
          <CustomText style={[styles.sub, { color: COLORS.textMuted }]}>
            Track what’s booked — effortlessly.
          </CustomText>

          <EventCard
            item={demoEvent}
            colors={COLORS}
            onPressTrack={onPressTrackStatus}
          />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </BaseContainer>
  );
};

function PrimaryButton({
  label,
  onPress,
  background,
}: {
  label: string;
  onPress: () => void;
  background: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[styles.primaryBtn, { backgroundColor: background }]}
    >
      <CustomText style={styles.primaryBtnText}>{label}</CustomText>
    </TouchableOpacity>
  );
}

function EventCard({
  item,
  onPressTrack,
  colors,
}: {
  item: EventItem;
  onPressTrack: () => void;
  colors: any;
}) {
  return (
    <View
      style={[
        styles.card,
        { borderColor: colors.border, backgroundColor: colors.cardBg },
      ]}
    >
      {/* Top row */}
      <View style={styles.cardTopRow}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.cardImage}
        />
        <View style={styles.cardInfo}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <CustomText
                style={[styles.cardTitle, { color: colors.textPrimary }]}
              >
                {item.titleLine1}
              </CustomText>
              {!!item.titleLine2 && (
                <CustomText
                  style={[styles.cardTitle, { color: colors.textPrimary }]}
                >
                  {item.titleLine2}
                </CustomText>
              )}
            </View>

            <View style={[styles.chip, { backgroundColor: colors.chipBg }]}>
              <CustomText
                style={[styles.chipText, { color: colors.textPrimary }]}
              >
                {item.status}
              </CustomText>
            </View>
          </View>

          <CustomText style={[styles.price, { color: colors.textPrimary }]}>
            {item.priceText}
          </CustomText>

          <CustomText style={[styles.orderId, { color: colors.textMuted }]}>
            Order id:{item.orderId}
          </CustomText>
        </View>
      </View>

      {/* Progress */}
      <ProgressTracker
        steps={item.steps}
        completedSteps={item.completedSteps}
        primary={colors.primary}
        ring={colors.ring}
        line={colors.line}
      />

      {/* Track status button */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPressTrack}
        style={[styles.trackBtn, { backgroundColor: colors.primary }]}
      >
        <CustomText style={styles.trackBtnText}>Track Status</CustomText>
      </TouchableOpacity>
    </View>
  );
}

function ProgressTracker({
  steps,
  completedSteps,
  primary,
  ring,
  line,
}: {
  steps: number;
  completedSteps: number;
  primary: string;
  ring: string;
  line: string;
}) {
  const dots = new Array(steps).fill(0);

  return (
    <View style={styles.progressWrap}>
      {/* Dashed line behind dots */}
      <View
        style={[
          styles.progressLine,
          {
            borderColor: line,
          },
        ]}
      />

      <View style={styles.progressRow}>
        {dots.map((_, idx) => {
          const isDone = idx < completedSteps;
          const isLastUndone = idx >= completedSteps;

          return (
            <View
              key={idx}
              style={styles.dotSlot}
            >
              <View style={[styles.dotOuter, { backgroundColor: ring }]}>
                <View
                  style={[
                    styles.dotInner,
                    { backgroundColor: isDone ? primary : '#CFCFCF' },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
  },
  section: {
    paddingTop: 6,
  },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: Platform.select({ ios: '700', android: '700', default: '700' }),
    textAlign: 'center',
    marginTop: 10,
  },
  sub: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 6,
  },

  primaryBtn: {
    marginTop: 16,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  card: {
    marginTop: 14,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardImage: {
    width: 74,
    height: 74,
    borderRadius: 8,
    backgroundColor: '#EEE',
  },
  cardInfo: {
    flex: 1,
    paddingLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
  },
  chip: {
    minWidth: 72,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  price: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '800',
  },
  orderId: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
  },

  progressWrap: {
    marginTop: 12,
    paddingHorizontal: 6,
    paddingVertical: 10,
    position: 'relative',
  },
  progressLine: {
    position: 'absolute',
    left: 18,
    right: 18,
    top: 24,
    borderTopWidth: 2,
    borderStyle: 'dashed',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dotSlot: {
    width: 44,
    alignItems: 'center',
  },
  dotOuter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },

  trackBtn: {
    marginTop: 6,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});

export default EventsScreen;
