import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BaseContainer } from '../../components/BaseContainer';
import CustomText from '../../components/CustomText';
import ScreenHeader from '../../components/ScreenHeader';
import { AppColors } from '../../theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { RootStackParamList } from '../../navigation/RootNavigator';
import {
  getEventByIdAPI,
  checkPaymentStatusAPI,
} from '../../services/api/eventService';
import { payWithPhonePe } from '../../services/phonePeSdk';

type Props = NativeStackScreenProps<RootStackParamList, 'EventDetails'>;

const isPaid = (status?: string) =>
  status === 'advance' || status === 'paid_fully';

const fmtDate = (iso?: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const money = (n?: number) =>
  `₹ ${Number(n || 0).toLocaleString('en-IN')}`;

const EventDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { eventId } = route.params;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Payment flow state
  const [paying, setPaying] = useState(false);

  const fetchDetail = useCallback(async () => {
    try {
      setError(null);
      const res = await getEventByIdAPI(eventId);
      setEvent(res?.data ?? null);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load event details.');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const payment = event?.payment || {};
  const pending = !isPaid(payment.payment_status);

  // How much to collect now: half for a not-yet-started HALF-advance plan,
  // otherwise the outstanding balance.
  const payableNow = useMemo(() => {
    const total = Number(payment.total_amount || 0);
    const paid = Number(payment.paid_amount || 0);
    if (payment.advance_type === 'HALF' && paid === 0) {
      return Math.round(total / 2);
    }
    return Math.max(0, total - paid);
  }, [payment.total_amount, payment.paid_amount, payment.advance_type]);

  const onPay = async () => {
    if (payableNow <= 0) {
      Alert.alert('Nothing to pay', 'This event has no outstanding amount.');
      return;
    }
    try {
      setPaying(true);
      const { status, merchantOrderId } = await payWithPhonePe(
        eventId,
        payableNow,
      );

      if (status === 'SUCCESS') {
        // Never trust the SDK result alone — confirm server-side.
        if (merchantOrderId) {
          const res = await checkPaymentStatusAPI(merchantOrderId);
          if (isPaid(res?.data?.payment_status)) {
            await fetchDetail();
            Alert.alert('Payment successful', 'Your payment has been confirmed.');
            return;
          }
        }
        await fetchDetail();
        Alert.alert('Payment received', 'We are confirming your payment shortly.');
      } else if (status === 'INTERRUPTED') {
        Alert.alert('Payment cancelled', 'The payment was interrupted before completing.');
      } else {
        Alert.alert('Payment failed', 'The payment did not go through. Please try again.');
      }
    } catch (e: any) {
      Alert.alert('Payment', e?.message || 'Failed to start payment.');
    } finally {
      setPaying(false);
    }
  };

  return (
    <BaseContainer>
      <ScreenHeader
        title="Event Details"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={AppColors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <CustomText style={{ color: AppColors.textGrey, textAlign: 'center' }}>
            {error}
          </CustomText>
          <TouchableOpacity onPress={fetchDetail} style={{ marginTop: 12 }}>
            <CustomText weight="bold" style={{ color: AppColors.primary }}>
              Retry
            </CustomText>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Header card */}
          <View style={styles.card}>
            <Image
              source={require('../../assets/images/event.jpg')}
              style={styles.banner}
            />
            <View style={styles.titleRow}>
              <CustomText
                weight="extraBold"
                style={[styles.title, { color: AppColors.textPrimary }]}
              >
                {event?.event_name}
              </CustomText>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: pending
                      ? AppColors.divider
                      : AppColors.surface,
                  },
                ]}
              >
                <CustomText
                  weight="bold"
                  style={{ color: AppColors.textPrimary, fontSize: moderateScale(12) }}
                >
                  {pending ? 'Pending' : 'Booked'}
                </CustomText>
              </View>
            </View>
          </View>

          {/* Basic details */}
          <SectionTitle text="Event Details" />
          <View style={styles.card}>
            <DetailRow label="Type" value={event?.event_type || '—'} />
            <DetailRow label="Starts" value={fmtDate(event?.event_start_datetime)} />
            <DetailRow label="Ends" value={fmtDate(event?.event_end_datetime)} />
            <DetailRow label="No. of days" value={String(event?.no_of_days ?? '—')} />
            <DetailRow label="Working hours" value={String(event?.working_hours ?? '—')} />
            <DetailRow
              label="Venue"
              value={event?.venue?.venue_name || '—'}
            />
            <DetailRow
              label="Address"
              value={event?.venue?.formatted_address || '—'}
            />
            <DetailRow
              label="City / State"
              value={[event?.city, event?.state].filter(Boolean).join(', ') || '—'}
              last
            />
          </View>

          {/* Payment summary */}
          <SectionTitle text="Payment" />
          <View style={styles.card}>
            <DetailRow label="Total" value={money(payment.total_amount)} />
            <DetailRow label="Paid" value={money(payment.paid_amount)} />
            <DetailRow
              label="Balance"
              value={money(
                Math.max(
                  0,
                  Number(payment.total_amount || 0) -
                    Number(payment.paid_amount || 0),
                ),
              )}
            />
            <DetailRow
              label="Status"
              value={pending ? 'Pending' : payment.payment_status}
              last
            />
          </View>

          {/* Pay CTA — only when payment is pending */}
          {pending && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={onPay}
              disabled={paying}
              style={[styles.payBtn, { backgroundColor: AppColors.primary }]}
            >
              {paying ? (
                <ActivityIndicator color={AppColors.textInverse} />
              ) : (
                <CustomText weight="bold" style={styles.payBtnText}>
                  {`Pay ${money(payableNow)}`}
                </CustomText>
              )}
            </TouchableOpacity>
          )}

          <View style={{ height: verticalScale(30) }} />
        </ScrollView>
      )}
    </BaseContainer>
  );
};

function SectionTitle({ text }: { text: string }) {
  return (
    <CustomText
      weight="bold"
      style={{
        color: AppColors.textPrimary,
        fontSize: moderateScale(16),
        marginTop: verticalScale(18),
        marginBottom: verticalScale(8),
      }}
    >
      {text}
    </CustomText>
  );
}

function DetailRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.detailRow,
        !last && {
          borderBottomWidth: moderateScale(1),
          borderBottomColor: AppColors.border,
        },
      ]}
    >
      <CustomText style={[styles.detailLabel, { color: AppColors.textGrey }]}>
        {label}
      </CustomText>
      <CustomText
        weight="medium"
        style={[styles.detailValue, { color: AppColors.textPrimary }]}
      >
        {value}
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: scale(18),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(20),
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(24),
  },
  card: {
    backgroundColor: AppColors.card,
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
    borderColor: AppColors.border,
    padding: scale(14),
  },
  banner: {
    width: '100%',
    height: verticalScale(150),
    borderRadius: moderateScale(10),
    backgroundColor: AppColors.surface,
    marginBottom: verticalScale(12),
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: scale(10),
  },
  title: {
    flex: 1,
    fontSize: moderateScale(20),
  },
  badge: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: verticalScale(10),
    gap: scale(12),
  },
  detailLabel: {
    fontSize: moderateScale(13),
    flexShrink: 0,
  },
  detailValue: {
    fontSize: moderateScale(13),
    flex: 1,
    textAlign: 'right',
  },
  payBtn: {
    marginTop: verticalScale(22),
    height: verticalScale(54),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: {
    color: AppColors.textInverse,
    fontSize: moderateScale(17),
  },
});

export default EventDetailsScreen;
