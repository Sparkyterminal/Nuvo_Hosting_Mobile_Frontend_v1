import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseContainer } from '../../components/BaseContainer';
import CustomText from '../../components/CustomText';
import { HomeTabParamList } from '../../navigation/HomeTabsNavigator';
import ScreenHeader from '../../components/ScreenHeader';
import { AppColors } from '../../theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getMyEvents } from '../../features/events/eventSlice';

type Props = NativeStackScreenProps<HomeTabParamList, 'Events'>;

type TabKey = 'booked' | 'pending';

// A payment is considered "booked" once any confirmed payment exists
// (a paid advance or a full payment). Anything else (unpaid / missing) is pending.
const isBookedEvent = (event: any): boolean => {
  const s = event?.payment_details?.payment_status;
  return s === 'advance' || s === 'paid_fully';
};

const EventsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.event);

  const [activeTab, setActiveTab] = useState<TabKey>('booked');

  // Refresh the list on mount and every time the screen regains focus.
  useEffect(() => {
    dispatch(getMyEvents());
    const unsub = navigation.addListener('focus', () => {
      dispatch(getMyEvents());
    });
    return unsub;
  }, [navigation, dispatch]);

  const bookedEvents = useMemo(
    () => (events || []).filter(isBookedEvent),
    [events],
  );
  const pendingEvents = useMemo(
    () => (events || []).filter((e: any) => !isBookedEvent(e)),
    [events],
  );

  const visibleEvents = activeTab === 'booked' ? bookedEvents : pendingEvents;

  const onPressBookEvents = () => {
    navigation.navigate('BookEventFlow');
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
        contentContainerStyle={[
          styles.content,
          { backgroundColor: AppColors.background },
        ]}
      >
        {/* Section 1 */}
        <View style={styles.section}>
          <CustomText
            weight="extraBold"
            style={[styles.h1, { color: AppColors.primary }]}
          >
            Your Event Starts Here
          </CustomText>
          <CustomText style={[styles.sub, { color: AppColors.textGrey }]}>
            Plan, book, and celebrate effortlessly.
          </CustomText>

          <PrimaryButton
            label="Book Events"
            onPress={onPressBookEvents}
            background={AppColors.primary}
          />

          {/* Booked / Pending tabs */}
          <View style={styles.tabRow}>
            <TabButton
              label="Booked Events"
              count={bookedEvents.length}
              active={activeTab === 'booked'}
              onPress={() => setActiveTab('booked')}
            />
            <TabButton
              label="Pending Events"
              count={pendingEvents.length}
              active={activeTab === 'pending'}
              onPress={() => setActiveTab('pending')}
            />
          </View>
        </View>

        {/* Section 2 */}
        <View style={[styles.section, { marginTop: 26 }]}>
          <CustomText style={[styles.h1, { color: AppColors.primary }]}>
            Your Events, the Nuvo Way
          </CustomText>
          <CustomText style={[styles.sub, { color: AppColors.textGrey }]}>
            {activeTab === 'booked'
              ? 'Track what’s booked — effortlessly.'
              : 'Payments awaiting completion.'}
          </CustomText>

          {loading && (events || []).length === 0 ? (
            <CustomText style={{ textAlign: 'center', marginTop: 20 }}>
              Loading…
            </CustomText>
          ) : visibleEvents.length === 0 ? (
            <CustomText
              style={{
                textAlign: 'center',
                marginTop: 20,
                color: AppColors.textGrey,
              }}
            >
              {activeTab === 'booked'
                ? 'No booked events yet.'
                : 'No pending events.'}
            </CustomText>
          ) : (
            visibleEvents.map((item: any) => (
              <EventCard
                key={item.event_id}
                event={item}
                badgeLabel={activeTab === 'booked' ? 'Booked' : 'Pending'}
                onPress={() =>
                  (navigation as any).navigate('EventDetails', {
                    eventId: item.event_id,
                  })
                }
              />
            ))
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </BaseContainer>
  );
};

function TabButton({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.tab, active && styles.tabActive]}
    >
      <CustomText
        weight={active ? 'bold' : 'medium'}
        style={[
          styles.tabText,
          { color: active ? AppColors.textInverse : AppColors.textGrey },
        ]}
      >
        {label} ({count})
      </CustomText>
    </TouchableOpacity>
  );
}

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
      <CustomText
        weight="bold"
        style={styles.primaryBtnText}
      >
        {label}
      </CustomText>
    </TouchableOpacity>
  );
}

const fmtCardDate = (iso?: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

function EventCard({
  event,
  badgeLabel,
  onPress,
}: {
  event: any;
  badgeLabel: 'Booked' | 'Pending';
  onPress: () => void;
}) {
  const priceText = `₹ ${Number(
    event?.payment_details?.total_amount || 0,
  ).toLocaleString('en-IN')}`;

  const dateText = fmtCardDate(event?.event_start_datetime);
  const venueText = event?.venue_name || event?.city || null;
  const typeText =
    [event?.event_type, event?.city].filter(Boolean).join(' • ') || null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        { borderColor: AppColors.border, backgroundColor: AppColors.card },
      ]}
    >
      {/* Top row */}
      <View style={styles.cardTopRow}>
        <Image
          source={require('../../assets/images/event.jpg')}
          style={styles.cardImage}
        />
        <View style={styles.cardInfo}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <CustomText
                weight="bold"
                style={[styles.cardTitle, { color: AppColors.textPrimary }]}
              >
                {event?.event_name}
              </CustomText>
            </View>

            <View
              style={[
                styles.chip,
                {
                  backgroundColor:
                    badgeLabel === 'Booked'
                      ? AppColors.surface
                      : AppColors.divider,
                },
              ]}
            >
              <CustomText
                weight="medium"
                style={[styles.chipText, { color: AppColors.textPrimary }]}
              >
                {badgeLabel}
              </CustomText>
            </View>
          </View>

          <CustomText
            weight="extraBold"
            style={[styles.price, { color: AppColors.textPrimary }]}
          >
            {priceText}
          </CustomText>

          {/* Basic event details */}
          {!!typeText && (
            <CustomText
              weight="medium"
              style={[styles.detailLine, { color: AppColors.textGrey }]}
            >
              {typeText}
            </CustomText>
          )}
          {!!dateText && (
            <CustomText
              weight="medium"
              style={[styles.detailLine, { color: AppColors.textGrey }]}
            >
              {dateText}
            </CustomText>
          )}
          {!!venueText && (
            <CustomText
              weight="medium"
              numberOfLines={1}
              style={[styles.detailLine, { color: AppColors.textGrey }]}
            >
              {venueText}
            </CustomText>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

// function ProgressTracker({
//   steps,
//   completedSteps,
//   primary,
//   ring,
//   line,
// }: {
//   steps: number;
//   completedSteps: number;
//   primary: string;
//   ring: string;
//   line: string;
// }) {
//   const dots = new Array(steps).fill(0);

//   return (
//     <View style={styles.progressWrap}>
//       {/* Dashed line behind dots */}
//       <View
//         style={[
//           styles.progressLine,
//           {
//             borderColor: line,
//           },
//         ]}
//       />

//       <View style={styles.progressRow}>
//         {dots.map((_, idx) => {
//           const isDone = idx < completedSteps;
//           const isLastUndone = idx >= completedSteps;

//           return (
//             <View
//               key={idx}
//               style={styles.dotSlot}
//             >
//               <View style={[styles.dotOuter, { backgroundColor: ring }]}>
//                 <View
//                   style={[
//                     styles.dotInner,
//                     { backgroundColor: isDone ? primary : AppColors.divider },
//                   ]}
//                 />
//               </View>
//             </View>
//           );
//         })}
//       </View>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(12),
  },
  section: {
    paddingTop: verticalScale(6),
  },
  h1: {
    fontSize: moderateScale(28),
    lineHeight: verticalScale(34),
    textAlign: 'center',
    marginTop: verticalScale(10),
  },
  sub: {
    fontSize: moderateScale(16),
    lineHeight: verticalScale(22),
    textAlign: 'center',
    marginTop: verticalScale(6),
  },

  primaryBtn: {
    marginTop: verticalScale(16),
    height: verticalScale(56),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  primaryBtnText: {
    color: AppColors.textInverse,
    fontSize: moderateScale(18),
  },

  tabRow: {
    flexDirection: 'row',
    marginTop: verticalScale(16),
    backgroundColor: AppColors.surface,
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
    borderColor: AppColors.border,
    padding: scale(4),
  },
  tab: {
    flex: 1,
    height: verticalScale(42),
    borderRadius: moderateScale(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: AppColors.primary,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabText: {
    fontSize: moderateScale(14),
  },

  card: {
    marginTop: verticalScale(14),
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(10),
    padding: scale(12),
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
    width: scale(74),
    height: verticalScale(74),
    borderRadius: moderateScale(8),
    backgroundColor: AppColors.surface,
  },
  cardInfo: {
    flex: 1,
    paddingLeft: scale(12),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(10),
  },
  cardTitle: {
    fontSize: moderateScale(18),
    lineHeight: verticalScale(22),
  },
  chip: {
    minWidth: moderateScale(72),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: moderateScale(14),
  },
  price: {
    marginTop: verticalScale(6),
    fontSize: moderateScale(18),
  },
  orderId: {
    marginTop: verticalScale(6),
    fontSize: moderateScale(14),
  },
  detailLine: {
    marginTop: verticalScale(4),
    fontSize: moderateScale(13),
  },

  progressWrap: {
    marginTop: verticalScale(12),
    paddingHorizontal: moderateScale(6),
    paddingVertical: verticalScale(10),
    position: 'relative',
  },
  progressLine: {
    position: 'absolute',
    left: scale(18),
    right: scale(18),
    top: scale(24),
    borderTopWidth: moderateScale(2),
    borderStyle: 'dashed',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dotSlot: {
    width: scale(44),
    alignItems: 'center',
  },
  dotOuter: {
    width: scale(34),
    height: verticalScale(34),
    borderRadius: moderateScale(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: scale(22),
    height: verticalScale(22),
    borderRadius: moderateScale(11),
  },

  trackBtn: {
    marginTop: verticalScale(6),
    height: verticalScale(56),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackBtnText: {
    color: AppColors.textInverse,
    fontSize: moderateScale(18),
  },
});

export default EventsScreen;
