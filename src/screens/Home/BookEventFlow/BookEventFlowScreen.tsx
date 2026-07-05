import { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { BaseContainer } from '../../../components/BaseContainer';
import CustomText from '../../../components/CustomText';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { LOCATION_DATA } from '../../../constants/locationData';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import StepOneForm from './StepOneForm';
import SelectableCard from './SelectableCard';
import FieldLabel from '../../../components/FieldLabel';
import { Fonts } from '../../../theme/fonts';
import { AppColors } from '../../../theme/colors';
import FooterButton from '../../../components/FooterButton';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createEvent, getMyEvents } from '../../../features/events/eventSlice';
import { validateCoupon } from '../../../services/api/validateCoupon';

type Props = NativeStackScreenProps<RootStackParamList, 'BookEventFlow'>;

type VenueDetails = {
  venue_name: string;
  formatted_address: string;
  latitude: number;
  longitude: number;
  place_id: string;
};

export interface Coupon {
  code: string;
  description: string;
  discount_type: 'PERCENTAGE' | 'FLAT';
  discount_value: number;
  usage_limit: number;
  is_active: boolean;
}

const STEPS = [
  'What Can we Do For You ?', // 0
  'Select Crew Package', // 1
  'Curate Your Look', // 2
  'GST Details', // 3
  'Invoice Summary', // 4
  'Payment', // 5
  'Success', // 6
] as const;

const DEFAULT_DURATION_HOURS = 6;

const LUXURY_RATE_PER_PERSON = 20000;
const PREMIUM_RATE_PER_PERSON = 10000;
const STANDARD_SHIFT_HOURS = 8;
const LUXURY_HOURLY_RATE = LUXURY_RATE_PER_PERSON / STANDARD_SHIFT_HOURS;
const PREMIUM_HOURLY_RATE = PREMIUM_RATE_PER_PERSON / STANDARD_SHIFT_HOURS;

const eventTypeOptions = [
  { label: 'Wedding', value: 'Wedding' },
  { label: 'Corporate', value: 'Corporate' },
  { label: 'Birthday', value: 'Birthday' },
  { label: 'Fashion Event', value: 'Fashion Event' },
  { label: 'Others', value: 'Others' },
];

export default function BookEventFlowScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const { uniforms } = useAppSelector((state) => state.uniform);
  const user = useAppSelector((state) => state.auth.user);

  const [step, setStep] = useState(0);
  const [eventType, setEventType] = useState<string | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<
    string | number | null
  >(null);
  // Uniform for the Luxury-crew slice of the booking (Luxury-only or Both package).
  const [selectedLuxuryUniformId, setSelectedLuxuryUniformId] = useState<
    number | string | null
  >(null);
  // Uniform for the Premium-crew slice of the booking (Premium-only or Both package).
  const [selectedPremiumUniformId, setSelectedPremiumUniformId] = useState<
    number | string | null
  >(null);
  // Luxury crew only: toggling this hides the standard uniform grid and shows a
  // "team will contact you" notice instead of picking a predefined uniform.
  const [isLuxuryCustomUniform, setIsLuxuryCustomUniform] = useState(false);

  const [selectedCrewPackage, setSelectedCrewPackage] = useState<
    'luxury' | 'premium' | 'both' | null
  >(null);
  const [luxuryCount, setLuxuryCount] = useState('');
  const [premiumCount, setPremiumCount] = useState('');

  const [venueDetails, setVenueDetails] = useState<VenueDetails | null>(null);
  const [workingHours, setWorkingHours] = useState('8'); // standard shift is 8 hours

  const { loading } = useAppSelector((state) => state.explore);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const pricingBreakdown = useMemo(() => {
    const luxuryQty =
      selectedCrewPackage !== 'premium' ? Number(luxuryCount) || 0 : 0;
    const premiumQty =
      selectedCrewPackage !== 'luxury' ? Number(premiumCount) || 0 : 0;
    const extraHours = Math.max(0, Number(workingHours) - STANDARD_SHIFT_HOURS);

    const luxuryBase = luxuryQty * LUXURY_RATE_PER_PERSON;
    const premiumBase = premiumQty * PREMIUM_RATE_PER_PERSON;
    const luxuryExtra = luxuryQty * extraHours * LUXURY_HOURLY_RATE;
    const premiumExtra = premiumQty * extraHours * PREMIUM_HOURLY_RATE;
    const subtotal = luxuryBase + premiumBase + luxuryExtra + premiumExtra;

    return {
      luxuryQty,
      premiumQty,
      extraHours,
      luxuryBase,
      premiumBase,
      luxuryExtra,
      premiumExtra,
      subtotal,
    };
  }, [selectedCrewPackage, luxuryCount, premiumCount, workingHours]);

  // "Custom Uniform" is now its own toggle (see isLuxuryCustomUniform), not a grid item, so
  // any backend catalog entry named "custom" is excluded from the normal uniform grid here.
  const predefinedUniforms = useMemo(() => {
    if (!uniforms) return [];
    const isCustom = (u: any) =>
      (u.category_name || '').toLowerCase().includes('custom');
    return uniforms.filter((u: any) => !isCustom(u));
  }, [uniforms]);

  useEffect(() => {
    if (route?.params?.selectedTheme) {
      setSelectedThemeId(route.params.selectedTheme.id);
    }
  }, [route?.params?.selectedTheme]);

  useEffect(() => {
    // Pre-selection from ThemeDetailsScreen's "Book Now" flow always applies to the
    // Luxury slot, since that list is the superset (custom + all predefined uniforms).
    if (route?.params?.selectedUniform) {
      setSelectedLuxuryUniformId(route.params.selectedUniform.id);
    }
  }, [route?.params?.selectedUniform]);

  const formatToISOWithoutMs = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const handleCreateEvent = async () => {
    if (!venueDetails) {
      alert('Please select venue');
      return;
    }

    const stateObj = LOCATION_DATA.find((s) => s.id === selectedState);

    const payload = {
      event_name: eventAbout,
      event_type: eventType,
      city: selectedCity,
      state: stateObj?.state,
      venue: {
        ...(venueDetails as VenueDetails),
        google_maps_url: `https://www.google.com/maps/place/?q=place_id:${venueDetails.place_id}`,
      },

      event_start_datetime: formatToISOWithoutMs(startDate),
      event_end_datetime: formatToISOWithoutMs(endDate),

      no_of_days: Number(days),
      working_hours: Number(workingHours),

      // client_id: user?.id,
      client_id: user?.profile_id,

      theme_id: selectedThemeId,
      luxury_uniform_type: isLuxuryUniformApplicable
        ? isLuxuryCustomUniform
          ? 'custom'
          : 'predefined'
        : undefined,
      luxury_uniform_id:
        isLuxuryUniformApplicable && !isLuxuryCustomUniform
          ? selectedLuxuryUniformId
          : undefined,
      premium_uniform_id: isPremiumUniformApplicable
        ? selectedPremiumUniformId
        : undefined,

      crew_package: selectedCrewPackage,
      luxury_crew_count: pricingBreakdown.luxuryQty,
      premium_crew_count: pricingBreakdown.premiumQty,
      total_crew_count: pricingBreakdown.luxuryQty + pricingBreakdown.premiumQty,
      pricing: {
        subtotal: pricingBreakdown.subtotal,
        discount: discountAmount,
        total: finalAmount,
      },
      payment_method: paymentMethod,
      payment_plan: paymentPlan,
      message: message || undefined,

      gst_details: companyName
        ? {
            company_name: companyName,
            address: companyAddress,
            gst_number: gstNumber,
          }
        : undefined,
    };

    try {
      const res = await dispatch(createEvent(payload)).unwrap();

      console.log('✅ EVENT CREATED:', res);
      dispatch(getMyEvents());

      // move to success step
      setStep(STEPS.length - 1);
    } catch (err: any) {
      console.log('❌ ERROR:', err);
      alert(err || 'Failed to create event');
    }
  };

  // Step 1 form state
  const [eventAbout, setEventAbout] = useState('');
  const [venue, setVenue] = useState('');
  const [days, setDays] = useState('1');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [activeField, setActiveField] = useState<
    'startDate' | 'startTime' | 'endDate' | 'endTime' | null
  >(null);

  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // date and time picker
  const showPicker = (
    field: 'startDate' | 'startTime' | 'endDate' | 'endTime',
    mode: 'date' | 'time',
  ) => {
    setActiveField(field);
    setPickerMode(mode);
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
  };

  const DEFAULT_DURATION_HOURS = 6;

  const handleConfirm = (selected: Date) => {
    if (!activeField) return;

    let updatedStart = new Date(startDate);
    let updatedEnd = new Date(endDate);

    // ✅ START DATE
    if (activeField === 'startDate') {
      updatedStart.setFullYear(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate(),
      );

      setStartDate(updatedStart);

      // auto adjust end
      updatedEnd = new Date(updatedStart);
      updatedEnd.setHours(updatedStart.getHours() + DEFAULT_DURATION_HOURS);
      setEndDate(updatedEnd);
    }

    // ✅ START TIME (MOST IMPORTANT 🔥)
    if (activeField === 'startTime') {
      updatedStart.setHours(selected.getHours(), selected.getMinutes());
      setStartDate(updatedStart);

      // auto adjust end
      updatedEnd = new Date(updatedStart);
      updatedEnd.setHours(updatedStart.getHours() + DEFAULT_DURATION_HOURS);
      setEndDate(updatedEnd);
    }

    // ✅ END DATE (manual override allowed)
    if (activeField === 'endDate') {
      updatedEnd.setFullYear(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate(),
      );
      setEndDate(updatedEnd);
    }

    // ✅ END TIME (manual override allowed)
    if (activeField === 'endTime') {
      updatedEnd.setHours(selected.getHours(), selected.getMinutes());
      setEndDate(updatedEnd);
    }

    hidePicker();
  };

  // const handleConfirm = (selected: Date) => {
  //   if (!activeField) return;

  //   // if (activeField === 'startDate') {
  //   //   const updated = new Date(startDate);
  //   //   updated.setFullYear(
  //   //     selected.getFullYear(),
  //   //     selected.getMonth(),
  //   //     selected.getDate(),
  //   //   );
  //   //   setStartDate(updated);
  //   // }

  //   if (activeField === 'startDate') {
  //     const updated = new Date(startDate);
  //     updated.setFullYear(
  //       selected.getFullYear(),
  //       selected.getMonth(),
  //       selected.getDate(),
  //     );
  //     setStartDate(updated);

  //     const newEnd = new Date(updated);
  //     newEnd.setHours(updated.getHours() + 6);

  //     setEndDate(newEnd);
  //   }

  //   if (activeField === 'endDate') {
  //     const updated = new Date(endDate);
  //     updated.setFullYear(
  //       selected.getFullYear(),
  //       selected.getMonth(),
  //       selected.getDate(),
  //     );
  //     setEndDate(updated);
  //   }

  //   if (activeField === 'endTime') {
  //     const updated = new Date(endDate);
  //     updated.setHours(selected.getHours(), selected.getMinutes());
  //     setEndDate(updated);
  //   }

  //   hidePicker();
  // };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

  // Preaspering dropdown data

  const stateOptions = LOCATION_DATA.map((item) => ({
    label: item.state,
    value: item.id,
  }));

  const cityOptions = useMemo(() => {
    const found = LOCATION_DATA.find((item) => item.id === selectedState);

    if (!found) return [];

    return found.cities.map((city) => ({
      label: city.name,
      value: city.name,
    }));
  }, [selectedState]);

  const selectedCityCoords = useMemo(() => {
    const state = LOCATION_DATA.find((s) => s.id === selectedState);
    const city = state?.cities.find((c) => c.name === selectedCity);
    return city ? { lat: city.lat, lng: city.lng } : null;
  }, [selectedState, selectedCity]);

  // Step 3 GST + Message
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [message, setMessage] = useState('');

  // Step 5 payment
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online' | null>(
    null,
  );
  const [paymentPlan, setPaymentPlan] = useState<'full' | 'advance' | null>(
    null,
  );

  const daysUntilEvent = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDay = new Date(startDate);
    eventDay.setHours(0, 0, 0, 0);
    const diffMs = eventDay.getTime() - today.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }, [startDate]);

  // Doc only specifies rules for <=7 days (full only) and >12 days (flexible).
  // 8-12 days is unspecified — defaulting to the more permissive "flexible" behavior.
  const paymentTiming = daysUntilEvent <= 7 ? 'full-only' : 'flexible';

  useEffect(() => {
    if (paymentTiming === 'full-only' && paymentPlan !== 'full') {
      setPaymentPlan('full');
    }
  }, [paymentTiming]);

  const finalAmount = Math.max(0, pricingBreakdown.subtotal - discountAmount);

  const payableNowAmount =
    paymentPlan === 'advance' ? Math.round(finalAmount / 2) : finalAmount;

  const totalAmount = `₹ ${payableNowAmount.toLocaleString('en-IN')}`;

  const title = STEPS[step];

  const onBack = () => {
    if (step > 0) setStep((s) => s - 1);
    else navigation.goBack();
  };

  const isLuxuryUniformApplicable =
    selectedCrewPackage === 'luxury' || selectedCrewPackage === 'both';
  const isPremiumUniformApplicable =
    selectedCrewPackage === 'premium' || selectedCrewPackage === 'both';

  // Custom Uniform toggle satisfies the Luxury requirement on its own — the "team
  // will contact you" flow doesn't need a predefined uniform picked.
  const isLuxuryUniformSatisfied =
    !isLuxuryUniformApplicable ||
    isLuxuryCustomUniform ||
    !!selectedLuxuryUniformId;
  const isPremiumUniformSatisfied =
    !isPremiumUniformApplicable || !!selectedPremiumUniformId;

  const isUniformStepValid =
    !!selectedCrewPackage &&
    isLuxuryUniformSatisfied &&
    isPremiumUniformSatisfied;

  const onNext = () => {
    if (step === 0 && (!eventType || !eventAbout.trim() || !venue.trim()))
      return;

    if (step === 1) {
      if (!selectedCrewPackage) return;
      if (
        (selectedCrewPackage === 'luxury' || selectedCrewPackage === 'both') &&
        pricingBreakdown.luxuryQty <= 0
      )
        return;
      if (
        (selectedCrewPackage === 'premium' || selectedCrewPackage === 'both') &&
        pricingBreakdown.premiumQty <= 0
      )
        return;
    }

    if (step === 2 && !isUniformStepValid) return;

    if (step === 5) {
      if (!paymentMethod) return;
      if (paymentTiming === 'flexible' && !paymentPlan) return;
    }

    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const onGoHome = () => {
    // go back to tabs
    navigation.popToTop();
    navigation.navigate('Home');
  };

  const isDisabled =
    (step === 0 && (!eventAbout.trim() || !venue.trim())) ||
    (step === 1 &&
      (!selectedCrewPackage ||
        ((selectedCrewPackage === 'luxury' || selectedCrewPackage === 'both') &&
          pricingBreakdown.luxuryQty <= 0) ||
        ((selectedCrewPackage === 'premium' ||
          selectedCrewPackage === 'both') &&
          pricingBreakdown.premiumQty <= 0))) ||
    (step === 2 && !isUniformStepValid) ||
    (step === 5 &&
      (!paymentMethod || (paymentTiming === 'flexible' && !paymentPlan)));

  const isLastStep = step === STEPS.length - 1;

  const footerLabel = isLastStep
    ? 'Go to Home'
    : step === 5
      ? totalAmount
      : 'Proceed to Next Step';

  // const footerAction = isLastStep ? onGoHome : onNext;
  const footerAction =
    step === 5 ? handleCreateEvent : isLastStep ? onGoHome : onNext;

  const progressPct = ((step + 1) / STEPS.length) * 100;

  // Animated progress bar fill — grows/shrinks smoothly instead of snapping to the new width.
  const progressAnim = useRef(new Animated.Value(progressPct)).current;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPct,
      duration: 350,
      useNativeDriver: false, // width isn't supported by the native driver
    }).start();
  }, [progressPct]);

  // Step transition animation — fades/slides the step content in on every step change,
  // sliding from the right when moving forward and from the left when moving back.
  const prevStepRef = useRef(step);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contentTranslateX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const direction =
      step > prevStepRef.current ? 1 : step < prevStepRef.current ? -1 : 0;
    prevStepRef.current = step;

    contentOpacity.setValue(0);
    contentTranslateX.setValue(direction * 24);

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  const openUniformDetails = (item: any) =>
    navigation.navigate('ThemeDetails', {
      data: {
        id: item.id,
        title: item.category_name,
        description: `${item.category_name} includes premium fabric and professional styling.`,
        image: { uri: item.images?.[0] },
        color: AppColors.primary,
      },
      from: 'bookFlow',
      type: 'uniform',
    });

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      alert('Please enter coupon code');
      return;
    }

    try {
      setCouponLoading(true);

      const response = await validateCoupon(code);

      if (!response.success) {
        alert(response.message);
        return;
      }

      const coupon = response.data;

      let discount = 0;

      if (coupon.discount_type === 'PERCENTAGE') {
        discount = (coupon.discount_value / 100) * pricingBreakdown.subtotal;
      } else {
        discount = coupon.discount_value;
      }

      discount = Math.min(discount, pricingBreakdown.subtotal);

      setAppliedCoupon(coupon);
      setDiscountAmount(discount);

      alert('Coupon Applied Successfully');
    } catch (error: any) {
      alert(error?.response?.data?.message || 'Failed to validate coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <BaseContainer>
      {/* Header + Progress (fixed top) */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: AppColors.background,
            borderBottomColor: AppColors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={onBack}
          style={styles.headerLeft}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={AppColors.primary}
          />
        </TouchableOpacity>

        <CustomText
          weight="extraBold"
          style={[styles.headerTitle, { color: AppColors.primary }]}
        >
          {title}
        </CustomText>

        {/* <View style={styles.headerRight} /> */}

        <View style={styles.progressWrap}>
          <View
            style={[styles.progressTrack, { backgroundColor: AppColors.track }]}
          >
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: AppColors.primary,
                },
              ]}
            />
          </View>

          <CustomText
            weight="medium"
            style={[styles.progressText, { color: AppColors.textSecondary }]}
          >
            {step + 1} / {STEPS.length}
          </CustomText>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        contentContainerStyle={[
          styles.body,
          { backgroundColor: AppColors.background },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          style={{
            opacity: contentOpacity,
            transform: [{ translateX: contentTranslateX }],
          }}
        >
        {step === 0 && (
          <StepOneForm
            stateOptions={stateOptions}
            cityOptions={cityOptions}
            selectedState={selectedState}
            selectedCity={selectedCity}
            setSelectedState={setSelectedState}
            setSelectedCity={setSelectedCity}
            eventAbout={eventAbout}
            setEventAbout={setEventAbout}
            venue={venue}
            setVenue={setVenue}
            days={days}
            setDays={setDays}
            startDate={startDate}
            endDate={endDate}
            formatDate={formatDate}
            formatTime={formatTime}
            showPicker={showPicker}
            eventType={eventType}
            setEventType={setEventType}
            eventTypeOptions={eventTypeOptions}
            setVenueDetails={setVenueDetails}
            selectedCityCoords={selectedCityCoords}
          />
        )}

        {step === 1 && (
          <View style={styles.card}>
            <FieldLabel text="Select Crew Package" />

            <View
              style={{ gap: verticalScale(10), marginTop: verticalScale(8) }}
            >
              {(
                [
                  { id: 'luxury', title: 'Luxury' },
                  { id: 'premium', title: 'Premium' },
                  { id: 'both', title: 'Both (Luxury + Premium)' },
                ] as const
              ).map((p) => {
                const selected = selectedCrewPackage === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    activeOpacity={0.9}
                    onPress={() => {
                      setSelectedCrewPackage(p.id);
                      if (p.id === 'premium') {
                        setLuxuryCount('');
                        setSelectedLuxuryUniformId(null);
                        setIsLuxuryCustomUniform(false);
                      }
                      if (p.id === 'luxury') {
                        setPremiumCount('');
                        setSelectedPremiumUniformId(null);
                      }
                    }}
                    style={[
                      styles.packageRow,
                      {
                        borderColor: selected
                          ? AppColors.primary
                          : AppColors.border,
                        backgroundColor: AppColors.card,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={
                        p.id === 'luxury'
                          ? 'diamond-stone'
                          : p.id === 'premium'
                            ? 'crown'
                            : 'star-circle'
                      }
                      size={22}
                      color={
                        selected ? AppColors.primary : AppColors.textSecondary
                      }
                    />
                    <CustomText
                      weight="bold"
                      style={{
                        flex: 1,
                        marginLeft: scale(10),
                        color: AppColors.textPrimary,
                      }}
                    >
                      {p.title}
                    </CustomText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {(selectedCrewPackage === 'luxury' ||
              selectedCrewPackage === 'both') && (
              <View style={{ marginTop: verticalScale(12) }}>
                <CustomText
                  weight="bold"
                  style={{ marginBottom: verticalScale(6) }}
                >
                  Luxury Crew Count
                </CustomText>
                <TextInput
                  value={luxuryCount}
                  onChangeText={setLuxuryCount}
                  keyboardType="number-pad"
                  placeholder="e.g. 5"
                  placeholderTextColor={AppColors.textGrey}
                  style={styles.input}
                />
              </View>
            )}

            {(selectedCrewPackage === 'premium' ||
              selectedCrewPackage === 'both') && (
              <View style={{ marginTop: verticalScale(12) }}>
                <CustomText
                  weight="bold"
                  style={{ marginBottom: verticalScale(6) }}
                >
                  Premium Crew Count
                </CustomText>
                <TextInput
                  value={premiumCount}
                  onChangeText={setPremiumCount}
                  keyboardType="number-pad"
                  placeholder="e.g. 5"
                  placeholderTextColor={AppColors.textGrey}
                  style={styles.input}
                />
              </View>
            )}

            {selectedCrewPackage && (
              <View style={{ marginTop: verticalScale(12) }}>
                <CustomText
                  weight="bold"
                  style={{ marginBottom: verticalScale(6) }}
                >
                  Working Hours
                </CustomText>
                <TextInput
                  value={workingHours}
                  onChangeText={setWorkingHours}
                  keyboardType="number-pad"
                  placeholder="Standard shift is 8 hours"
                  placeholderTextColor={AppColors.textGrey}
                  style={styles.input}
                />
                {pricingBreakdown.extraHours > 0 && (
                  <CustomText
                    style={{
                      marginTop: verticalScale(6),
                      color: AppColors.textSecondary,
                      fontSize: moderateScale(12),
                    }}
                  >
                    {`${pricingBreakdown.extraHours} extra hour${pricingBreakdown.extraHours === 1 ? '' : 's'} beyond the standard 8-hour shift will be charged`}
                    {selectedCrewPackage === 'luxury' &&
                      ` at ₹${LUXURY_HOURLY_RATE.toLocaleString('en-IN')}/hr per Luxury crew member.`}
                    {selectedCrewPackage === 'premium' &&
                      ` at ₹${PREMIUM_HOURLY_RATE.toLocaleString('en-IN')}/hr per Premium crew member.`}
                    {selectedCrewPackage === 'both' &&
                      ` at ₹${LUXURY_HOURLY_RATE.toLocaleString('en-IN')}/hr per Luxury crew member and ₹${PREMIUM_HOURLY_RATE.toLocaleString('en-IN')}/hr per Premium crew member.`}
                  </CustomText>
                )}
              </View>
            )}

            {selectedCrewPackage && (
              <View style={{ marginTop: verticalScale(14) }}>
                <CustomText
                  weight="bold"
                  style={{ color: AppColors.textPrimary }}
                >
                  Price Preview
                </CustomText>
                {pricingBreakdown.luxuryQty > 0 && (
                  <RowKV
                    k={`Luxury × ${pricingBreakdown.luxuryQty}`}
                    v={`₹${pricingBreakdown.luxuryBase.toLocaleString('en-IN')}`}
                  />
                )}
                {pricingBreakdown.premiumQty > 0 && (
                  <RowKV
                    k={`Premium × ${pricingBreakdown.premiumQty}`}
                    v={`₹${pricingBreakdown.premiumBase.toLocaleString('en-IN')}`}
                  />
                )}
                {pricingBreakdown.extraHours > 0 && (
                  <RowKV
                    k={`Extra Hours (${pricingBreakdown.extraHours} hrs)`}
                    v={`₹${(
                      pricingBreakdown.luxuryExtra +
                      pricingBreakdown.premiumExtra
                    ).toLocaleString('en-IN')}`}
                  />
                )}
                <RowKV
                  k="Running Total"
                  v={`₹${pricingBreakdown.subtotal.toLocaleString('en-IN')}`}
                  bold
                />
              </View>
            )}
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: verticalScale(16) }}>
            {isLuxuryUniformApplicable && (
              <View style={styles.themCard}>
                <FieldLabel text="Uniform for Luxury Crew" />

                <View style={{ marginTop: verticalScale(8) }}>
                  <RadioRow
                    label="Custom Uniform"
                    selected={isLuxuryCustomUniform}
                    onPress={() => {
                      const next = !isLuxuryCustomUniform;
                      setIsLuxuryCustomUniform(next);
                      if (next) setSelectedLuxuryUniformId(null);
                    }}
                  />
                </View>

                {isLuxuryCustomUniform ? (
                  <CustomUniformNotice />
                ) : (
                  <UniformGrid
                    data={predefinedUniforms}
                    selectedId={selectedLuxuryUniformId}
                    onSelect={setSelectedLuxuryUniformId}
                    onViewPress={openUniformDetails}
                  />
                )}
              </View>
            )}

            {isPremiumUniformApplicable && (
              <View style={styles.themCard}>
                <FieldLabel text="Uniform for Premium Crew" />
                <UniformGrid
                  data={predefinedUniforms}
                  selectedId={selectedPremiumUniformId}
                  onSelect={setSelectedPremiumUniformId}
                  onViewPress={openUniformDetails}
                />
              </View>
            )}
          </View>
        )}

        {step === 3 && (
          <View style={styles.gstCard}>
            <FieldLabel text="GST Details for Corporate Events (optional)" />
            <TextInput
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Name of the company"
              placeholderTextColor={AppColors.textGrey}
              style={styles.input}
            />
            <TextInput
              value={companyAddress}
              onChangeText={setCompanyAddress}
              placeholder="Address"
              placeholderTextColor={AppColors.textGrey}
              style={[
                styles.input,
                { height: verticalScale(80), textAlignVertical: 'top' },
              ]}
              multiline
            />
            <TextInput
              value={gstNumber}
              onChangeText={setGstNumber}
              placeholder="GST Number"
              placeholderTextColor={AppColors.textGrey}
              style={styles.input}
            />
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Message (optional)"
              placeholderTextColor={AppColors.textGrey}
              style={[
                styles.input,
                { height: verticalScale(80), textAlignVertical: 'top' },
              ]}
              multiline
            />
          </View>
        )}

        {step === 4 && (
          <View style={styles.card}>
            <CustomText
              weight="extraBold"
              style={[styles.summaryTitle, { color: AppColors.textPrimary }]}
            >
              Invoice Summary
            </CustomText>

            <View
              style={[
                styles.summaryEventCard,
                { borderColor: AppColors.border },
              ]}
            >
              <Image
                source={require('../../../assets/images/home.jpg')}
                style={styles.summaryImage}
              />
              <View style={{ flex: 1, marginLeft: scale(10) }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <CustomText
                    weight="extraBold"
                    style={{ color: AppColors.textPrimary }}
                  >
                    {eventAbout || 'Untitled Event'}
                  </CustomText>
                </View>
                <CustomText
                  style={{ marginTop: 6, color: AppColors.textSecondary }}
                >
                  Date & Time: {formatDate(startDate)}, {formatTime(startDate)}
                </CustomText>
                <CustomText
                  style={{ marginTop: 4, color: AppColors.textSecondary }}
                >
                  Event Venue: {venueDetails?.formatted_address || venue || '-'}
                </CustomText>
                <CustomText
                  style={{ marginTop: 4, color: AppColors.textSecondary }}
                >
                  Package:{' '}
                  {selectedCrewPackage
                    ? selectedCrewPackage.charAt(0).toUpperCase() +
                      selectedCrewPackage.slice(1)
                    : '-'}
                </CustomText>
              </View>
            </View>

            <View style={{ marginTop: verticalScale(12) }}>
              <CustomText
                style={[styles.summaryTitle, { color: AppColors.textPrimary }]}
              >
                Billing Details
              </CustomText>

              {pricingBreakdown.luxuryQty > 0 && (
                <RowKV
                  k={`Luxury Crew (${pricingBreakdown.luxuryQty} × ₹${LUXURY_RATE_PER_PERSON.toLocaleString('en-IN')})`}
                  v={`₹${pricingBreakdown.luxuryBase.toLocaleString('en-IN')}`}
                />
              )}
              {pricingBreakdown.premiumQty > 0 && (
                <RowKV
                  k={`Premium Crew (${pricingBreakdown.premiumQty} × ₹${PREMIUM_RATE_PER_PERSON.toLocaleString('en-IN')})`}
                  v={`₹${pricingBreakdown.premiumBase.toLocaleString('en-IN')}`}
                />
              )}
              {pricingBreakdown.extraHours > 0 && (
                <RowKV
                  k={`Extra Hours Surcharge (${pricingBreakdown.extraHours} hrs)`}
                  v={`₹${(
                    pricingBreakdown.luxuryExtra +
                    pricingBreakdown.premiumExtra
                  ).toLocaleString('en-IN')}`}
                />
              )}

              <RowKV
                k="Subtotal"
                v={`₹${pricingBreakdown.subtotal.toLocaleString('en-IN')}`}
              />

              {discountAmount > 0 && (
                <RowKV
                  k="Coupon Discount"
                  v={`- ₹${discountAmount.toLocaleString('en-IN')}`}
                />
              )}

              {companyName ? (
                <RowKV
                  k="GST"
                  // TODO: GST rate not specified in requirements doc — shown informationally only, not included in Grand Total.
                  v="TBD"
                />
              ) : null}

              <RowKV
                k="Grand Total"
                v={`₹${finalAmount.toLocaleString('en-IN')}`}
                bold
              />
            </View>
            <View
              style={{
                marginTop: verticalScale(14),
              }}
            >
              <CustomText
                weight="bold"
                style={{
                  marginBottom: verticalScale(8),
                  color: AppColors.textPrimary,
                }}
              >
                Apply Coupon
              </CustomText>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: scale(10),
                }}
              >
                <TextInput
                  value={couponCode}
                  onChangeText={setCouponCode}
                  placeholder="Enter Coupon Code"
                  placeholderTextColor={AppColors.textGrey}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: AppColors.border,
                    backgroundColor: AppColors.surface,
                    borderRadius: moderateScale(10),
                    paddingHorizontal: scale(12),
                    paddingVertical: verticalScale(12),
                    color: AppColors.textPrimary,
                  }}
                />

                <TouchableOpacity
                  onPress={handleApplyCoupon}
                  style={{
                    backgroundColor: AppColors.primary,
                    paddingHorizontal: scale(18),
                    paddingVertical: verticalScale(12),
                    borderRadius: moderateScale(10),
                  }}
                >
                  <CustomText
                    weight="bold"
                    style={{ color: AppColors.textInverse }}
                  >
                    Apply
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {step === 5 && (
          <View style={styles.card}>
            <CustomText
              style={[styles.summaryTitle, { color: AppColors.textPrimary }]}
            >
              Payment Method
            </CustomText>
            <View
              style={{ marginTop: verticalScale(10), gap: verticalScale(10) }}
            >
              <RadioRow
                label="Cash Payment"
                selected={paymentMethod === 'cash'}
                onPress={() => setPaymentMethod('cash')}
              />
              <RadioRow
                label="Online Payment"
                selected={paymentMethod === 'online'}
                onPress={() => setPaymentMethod('online')}
              />
            </View>

            {paymentTiming === 'flexible' ? (
              <View style={{ marginTop: verticalScale(18) }}>
                <CustomText
                  style={[
                    styles.summaryTitle,
                    { color: AppColors.textPrimary },
                  ]}
                >
                  Payment Plan
                </CustomText>
                <View
                  style={{
                    marginTop: verticalScale(10),
                    gap: verticalScale(10),
                  }}
                >
                  <RadioRow
                    label="50% Advance"
                    selected={paymentPlan === 'advance'}
                    onPress={() => setPaymentPlan('advance')}
                  />
                  <RadioRow
                    label="Full Amount"
                    selected={paymentPlan === 'full'}
                    onPress={() => setPaymentPlan('full')}
                  />
                </View>
                {paymentPlan === 'advance' && (
                  <CustomText
                    style={{
                      marginTop: verticalScale(8),
                      color: AppColors.textSecondary,
                    }}
                  >
                    Remaining 50% is due 7 days before the event.
                  </CustomText>
                )}
              </View>
            ) : (
              <CustomText
                style={{
                  marginTop: verticalScale(14),
                  color: AppColors.textSecondary,
                }}
              >
                Full payment required — event is within 7 days.
              </CustomText>
            )}
          </View>
        )}

        {step === 6 && (
          <View style={styles.card}>
            <View
              style={{
                alignItems: 'center',
                paddingVertical: verticalScale(14),
              }}
            >
              <SuccessCheckmark />
              <CustomText
                weight="extraBold"
                style={{
                  marginTop: 10,
                  fontSize: 18,
                  color: AppColors.textPrimary,
                }}
              >
                Booking Successful
              </CustomText>
              <CustomText
                style={{
                  marginTop: 6,
                  textAlign: 'center',
                  color: AppColors.textSecondary,
                }}
              >
                You have successfully booked the event.
              </CustomText>
            </View>

            <View style={{ marginTop: verticalScale(10) }}>
              <RowKV
                k="Payment Mode"
                v={
                  paymentMethod === 'cash'
                    ? 'Cash Payment'
                    : paymentMethod === 'online'
                      ? 'Online Payment'
                      : '-'
                }
              />
              <RowKV
                k="Payment Plan"
                v={
                  paymentPlan === 'advance'
                    ? '50% Advance — remaining due 7 days before event'
                    : 'Full Payment'
                }
              />
              <RowKV
                k="Amount Paid"
                v={`₹${payableNowAmount.toLocaleString('en-IN')}`}
              />
              <RowKV
                k="Pay Date"
                v={formatDate(new Date())}
              />
              <RowKV
                k="Pay Time"
                v={formatTime(new Date())}
              />
              <View style={{ height: verticalScale(10) }} />
              <CustomText
                style={{ textAlign: 'center', color: AppColors.textSecondary }}
              >
                Total Pay
              </CustomText>
              <CustomText
                weight="extraBold"
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  color: AppColors.primary,
                }}
              >
                {totalAmount}
              </CustomText>

              <View
                style={{
                  marginTop: verticalScale(16),
                  alignItems: 'center',
                }}
              >
                <CustomText
                  style={{
                    textAlign: 'center',
                    color: AppColors.textSecondary,
                  }}
                >
                  Invoice will be sent to your email.
                </CustomText>
                <TouchableOpacity
                  onPress={() => alert('Invoice download coming soon')}
                  style={{
                    marginTop: verticalScale(10),
                    borderWidth: 1,
                    borderColor: AppColors.border,
                    borderRadius: moderateScale(10),
                    paddingHorizontal: scale(16),
                    paddingVertical: verticalScale(10),
                  }}
                >
                  <CustomText
                    weight="bold"
                    style={{ color: AppColors.primary }}
                  >
                    View / Download Invoice
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        </Animated.View>

        <View style={{ height: verticalScale(16) }} />
      </ScrollView>

      {/* <FooterButton
        label={footerLabel}
        onPress={footerAction}
        disabled={isDisabled}
        containerStyle={{ backgroundColor: AppColors.background }}
      /> */}
      <FooterButton
        label={loading ? 'Creating Event...' : footerLabel}
        onPress={footerAction}
        disabled={isDisabled || loading}
      />

      <DateTimePickerModal
        isVisible={pickerVisible}
        mode={pickerMode}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />
    </BaseContainer>
  );
}

function SuccessCheckmark() {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return (
    <Animated.View
      style={[
        styles.checkCircle,
        { borderColor: AppColors.primary, transform: [{ scale }] },
      ]}
    >
      <Ionicons
        name="checkmark"
        size={26}
        color={AppColors.primary}
      />
    </Animated.View>
  );
}

function CustomUniformNotice() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View
      style={{
        paddingVertical: verticalScale(28),
        alignItems: 'center',
      }}
    >
      <Animated.Text
        style={{
          opacity,
          color: AppColors.primary,
          fontFamily: Fonts.bold,
          fontSize: moderateScale(15),
          textAlign: 'center',
        }}
      >
        Our team will contact you soon.
      </Animated.Text>
    </View>
  );
}

function UniformGrid({
  data,
  selectedId,
  onSelect,
  onViewPress,
}: {
  data: any[];
  selectedId: number | string | null;
  onSelect: (id: any) => void;
  onViewPress: (item: any) => void;
}) {
  return (
    <FlatList
      data={data}
      keyExtractor={(i) => i.id}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={{ gap: scale(12) }}
      contentContainerStyle={{
        gap: scale(12),
        paddingTop: verticalScale(6),
      }}
      renderItem={({ item }) => {
        const selected = item.id === selectedId;

        return (
          <SelectableCard
            image={{ uri: item.images?.[0] }}
            title={item.category_name}
            price={item.price}
            selected={selected}
            onPress={() => onSelect(item.id)}
            onViewPress={() => onViewPress(item)}
            primaryColor={AppColors.primary}
            borderColor={AppColors.border}
            backgroundColor={AppColors.card}
          />
        );
      }}
    />
  );
}

function RowKV({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: verticalScale(8),
      }}
    >
      <CustomText
        weight={bold ? 'extraBold' : 'medium'}
        style={{ color: AppColors.textSecondary }}
      >
        {k}
      </CustomText>
      <CustomText
        weight={bold ? 'extraBold' : 'bold'}
        style={{ color: AppColors.textPrimary }}
      >
        {v}
      </CustomText>
    </View>
  );
}

function RadioRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(10),
        paddingHorizontal: scale(12),
        borderRadius: moderateScale(10),
        borderWidth: 1,
        borderColor: selected ? AppColors.primary : AppColors.textSecondary,
        backgroundColor: AppColors.card,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: scale(18),
            height: scale(18),
            borderRadius: scale(9),
            borderWidth: 2,
            borderColor: selected ? AppColors.primary : AppColors.textSecondary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {selected && (
            <View
              style={{
                width: scale(10),
                height: scale(10),
                borderRadius: scale(5),
                backgroundColor: AppColors.primary,
              }}
            />
          )}
        </View>
        <CustomText
          weight="bold"
          style={{ marginLeft: scale(10), color: AppColors.textPrimary }}
        >
          {label}
        </CustomText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    paddingHorizontal: scale(12),
    borderBottomWidth: moderateScale(1),
  },
  headerLeft: {
    width: moderateScale(40),
    height: moderateScale(40),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  headerRight: { width: scale(40), height: scale(40) },
  headerTitle: {
    position: 'absolute',
    top: verticalScale(18),
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: moderateScale(16),
    zIndex: 1,
  },

  progressWrap: {
    marginTop: verticalScale(6),
    paddingHorizontal: scale(6),
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10),
    backgroundColor: AppColors.background,
  },

  progressTrack: {
    height: verticalScale(4),
    borderRadius: moderateScale(999),
    overflow: 'hidden',
    flex: 1,
  },

  progressFill: {
    height: verticalScale(4),
    borderRadius: moderateScale(999),
  },
  progressText: {
    fontSize: moderateScale(12),
  },

  body: {
    padding: scale(14),
    paddingBottom: verticalScale(90),
  },
  card: {
    backgroundColor: AppColors.card,
    borderColor: AppColors.border,
    borderRadius: moderateScale(12),
    padding: scale(12),
    borderWidth: moderateScale(1),
  },
  themCard: {
    backgroundColor: AppColors.card,
    borderColor: AppColors.border,
    borderRadius: moderateScale(12),
    padding: scale(4),
    margin: moderateScale(-7),
    gap: moderateScale(6),
    borderWidth: moderateScale(1),
  },
  gstCard: {
    backgroundColor: AppColors.card,
    borderColor: AppColors.border,
    borderRadius: moderateScale(12),
    padding: scale(12),
    borderWidth: moderateScale(1),
    gap: scale(10),
  },
  input: {
    borderWidth: moderateScale(1),
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    color: AppColors.textPrimary,
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(10),
    fontFamily: Fonts.medium,
  },

  packageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
  },

  summaryTitle: { fontSize: 14 },
  summaryEventCard: {
    marginTop: verticalScale(10),
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(12),
    padding: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryImage: {
    width: scale(64),
    height: scale(64),
    borderRadius: moderateScale(10),
    backgroundColor: AppColors.surface,
  },
  badge: {
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(999),
    backgroundColor: AppColors.surface,
  },

  checkCircle: {
    width: scale(58),
    height: scale(58),
    borderRadius: scale(29),
    borderWidth: moderateScale(3),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.card,
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: scale(14),
    borderTopWidth: moderateScale(1),
  },
  cta: {
    height: verticalScale(54),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    color: AppColors.textInverse,
    fontSize: moderateScale(16),
  },

  modelCard: {
    width: '48%',
    backgroundColor: AppColors.card,
    borderRadius: moderateScale(12),
    borderWidth: moderateScale(1),
    overflow: 'hidden',
  },

  modelImage: {
    width: '100%',
    height: verticalScale(140),
  },
  modelHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdown: {
    height: verticalScale(40),
    borderWidth: moderateScale(1),
    borderColor: AppColors.border,
    backgroundColor: AppColors.card,
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(8),
  },
});
