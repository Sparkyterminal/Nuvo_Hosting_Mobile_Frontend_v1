import { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
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
import themesJson from '../../../services/themes.json';
import SelectableCard from './SelectableCard';
import Modal from 'react-native-modal';
import FieldLabel from '../../../components/FieldLabel';
import modelsJson from '../../../services/models.json';
import ModelCard from '../../../components/ModelCard';
import { Dropdown } from 'react-native-element-dropdown';
import { Fonts } from '../../../theme/fonts';
import { AppColors } from '../../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'BookEventFlow'>;

type UniformItem = { id: string; title: string; price: string; image: any };
type PackageItem = { id: string; title: string; icon: any };

const PACKAGE_DETAILS: Record<string, { title: string; description: string }> =
  {
    p1: {
      title: 'Diamond Edition',
      description:
        'Diamond personnel are curated on a bespoke basis and priced exclusively upon consultation.',
    },

    p2: {
      title: 'Platinum Edition',
      description: `Profile:
• Exceptionally groomed
• Fluent English, etiquette & protocol trained
• Luxury weddings / HNI / international brand exposure
• Calm, confident, high-presence individuals`,
    },

    p3: {
      title: 'Gold Edition',
      description: `Profile:
• Strong grooming & communication
• Experienced in premium weddings & curated events
• Graceful, polished presence`,
    },

    p4: {
      title: 'Silver Edition',
      description: `Profile:
• Well-trained & presentable
• Functional multi-lingual
• Professional hospitality behaviour`,
    },

    p5: {
      title: 'Bronze Edition',
      description: `Profile:
• Basic grooming & training
• Task-oriented roles
• Reliable manpower`,
    },
  };

const STEPS = [
  'What Can we Do For You ?', // 0
  'Select Your Mood', // 1
  'Curate Your Look', // 2
  'Curate Your Crew', // 3
  'Select Crew Members',
  'GST Details', // 5
  'Order Summary', // 6
  'Payment', // 7
  'Success', // 8
] as const;

type ThemeItem = {
  id: number;
  title: string;
  description: string;

  images: {
    id: number;
    url: string;
    description: string;
  }[];
};

type ModelItem = {
  id: string;
  name: string;
  height: string;
  image: string;
};

export default function BookEventFlowScreen({ navigation }: Props) {
  const [step, setStep] = useState(0);
  const themes: ThemeItem[] = themesJson.data;

  // Step 1 form state
  const [eventAbout, setEventAbout] = useState('');
  const [venue, setVenue] = useState('');
  const [staff, setStaff] = useState('2');
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
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null);

  const [isPackageInfoVisible, setIsPackageInfoVisible] = useState(false);
  const [activePackage, setActivePackage] = useState<PackageItem | null>(null);

  const models: ModelItem[] = modelsJson.data;

  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  const [modelViewMode, setModelViewMode] = useState<'1' | '2'>('2');
  const modelViewOptions = [
    { label: '1 View', value: '1' },
    { label: '2 View', value: '2' },
  ];

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

  const handleConfirm = (selected: Date) => {
    if (!activeField) return;

    if (activeField === 'startDate') {
      const updated = new Date(startDate);
      updated.setFullYear(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate(),
      );
      setStartDate(updated);
    }

    if (activeField === 'startTime') {
      const updated = new Date(startDate);
      updated.setHours(selected.getHours(), selected.getMinutes());
      setStartDate(updated);
    }

    if (activeField === 'endDate') {
      const updated = new Date(endDate);
      updated.setFullYear(
        selected.getFullYear(),
        selected.getMonth(),
        selected.getDate(),
      );
      setEndDate(updated);
    }

    if (activeField === 'endTime') {
      const updated = new Date(endDate);
      updated.setHours(selected.getHours(), selected.getMinutes());
      setEndDate(updated);
    }

    hidePicker();
  };

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
      label: city,
      value: city,
    }));
  }, [selectedState]);

  // Step 2 uniforms
  const uniforms: UniformItem[] = [
    {
      id: 'u1',
      title: 'Traditional Uniform',
      price: '₹44,499',
      image: require('../../../assets/images/home.jpg'),
    },
    {
      id: 'u2',
      title: 'Western',
      price: '₹44,499',
      image: require('../../../assets/images/home.jpg'),
    },
    {
      id: 'u3',
      title: 'Western',
      price: '₹44,499',
      image: require('../../../assets/images/home.jpg'),
    },
    {
      id: 'u4',
      title: 'Traditional Uniform',
      price: '₹44,499',
      image: require('../../../assets/images/home.jpg'),
    },
  ];
  const [selectedUniformId, setSelectedUniformId] = useState<string | null>(
    null,
  );

  // Step 3 packages
  const packages: PackageItem[] = [
    { id: 'p1', title: 'Diamond Edition', icon: 'diamond-stone' },
    { id: 'p2', title: 'Platinum Edition', icon: 'crown' },
    { id: 'p3', title: 'Gold Edition', icon: 'hexagon-slice-6' },
    { id: 'p4', title: 'Silver Edition', icon: 'hexagon-slice-4' },
    { id: 'p5', title: 'Bronze Edition', icon: 'hexagon-slice-2' },
  ];

  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );

  // Step 4 GST
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [gstNumber, setGstNumber] = useState('');

  // Step 6 payment
  const [payment, setPayment] = useState<
    'Paytm' | 'PhonePe' | 'GPay' | 'Card' | 'Cash' | null
  >(null);

  const totalAmount = '₹ 75,000,00.00';
  const payLabel = `Pay ${totalAmount}`;

  const title = STEPS[step];

  const onBack = () => {
    console.log('pressed ');
    if (step > 0) setStep((s) => s - 1);
    else navigation.goBack();
  };

  const onNext = () => {
    // Minimal validation (you can tighten later)
    if (step === 0 && (!eventAbout.trim() || !venue.trim())) return;
    // if (step === 1 && !selectedUniformId) return;
    // if (step === 2 && !selectedPackageId) return;
    // if (step === 5 && !payment) return;
    if (step === 1 && !selectedThemeId) return;
    if (step === 2 && !selectedUniformId) return;
    if (step === 3 && !selectedPackageId) return;
    if (step === 4 && !selectedModelId) return;
    if (step === 6 && !payment) return;

    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const onGoHome = () => {
    // go back to tabs
    navigation.popToTop();
    navigation.navigate('Home');
  };

  const progressPct = ((step + 1) / STEPS.length) * 100;

  const details = activePackage ? PACKAGE_DETAILS[activePackage.id] : null;

  return (
    <BaseContainer>
      {/* Header + Progress (fixed top) */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: AppColors.card,
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
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPct}%`,
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
            staff={staff}
            setStaff={setStaff}
            days={days}
            setDays={setDays}
            startDate={startDate}
            endDate={endDate}
            formatDate={formatDate}
            formatTime={formatTime}
            showPicker={showPicker}
          />
        )}

        {step === 1 && (
          <View style={styles.card}>
            {/* <FieldLabel text="Select Your Mood" /> */}

            <FlatList
              data={themes}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: verticalScale(12),
              }}
              renderItem={({ item }) => {
                const selected = item.id === selectedThemeId;

                return (
                  <SelectableCard
                    image={{ uri: item.images[0]?.url }}
                    title={item.title}
                    selected={selected}
                    onPress={() => setSelectedThemeId(item.id)}
                    onViewPress={() =>
                      navigation.navigate('ThemeDetails', {
                        data: {
                          id: item.id,
                          title: item.title,
                          description: item.description,
                          image: { uri: item.images[0]?.url },
                          color: AppColors.primary, // or your theme color
                        },
                      })
                    }
                    primaryColor={AppColors.primary}
                    borderColor={AppColors.border}
                    backgroundColor={AppColors.card}
                  />
                );
              }}
            />
          </View>
        )}

        {step === 2 && (
          <View style={styles.card}>
            {/* <FieldLabel text="Curate Your Look" /> */}
            <FlatList
              data={uniforms}
              keyExtractor={(i) => i.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{ gap: scale(12) }}
              contentContainerStyle={{
                gap: scale(12),
                paddingTop: verticalScale(6),
              }}
              renderItem={({ item }) => {
                const selected = item.id === selectedUniformId;

                return (
                  <SelectableCard
                    image={item.image}
                    title={item.title}
                    price={item.price}
                    selected={selected}
                    onPress={() => setSelectedUniformId(item.id)}
                    onViewPress={() =>
                      navigation.navigate('ThemeDetails', {
                        data: {
                          id: item.id,
                          title: item.title,
                          description: `${item.title} includes premium fabric and professional styling.`,
                          image: item.image,
                          color: AppColors.primary, // optional different color for uniforms
                        },
                      })
                    }
                    primaryColor={AppColors.primary}
                    borderColor={AppColors.border}
                    backgroundColor={AppColors.card}
                  />
                );
              }}
            />
          </View>
        )}

        {step === 3 && (
          <View style={styles.card}>
            {/* <FieldLabel text="Curate your crew" /> */}
            <View
              style={{ gap: verticalScale(10), marginTop: verticalScale(8) }}
            >
              {packages.map((p) => {
                const selected = p.id === selectedPackageId;
                return (
                  <TouchableOpacity
                    key={p.id}
                    activeOpacity={0.9}
                    onPress={() => setSelectedPackageId(p.id)}
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
                      name={p.icon}
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

                    {/* 👇 Add Info Icon */}
                    <TouchableOpacity
                      onPress={() => {
                        setActivePackage(p);
                        setIsPackageInfoVisible(true);
                      }}
                    >
                      <Ionicons
                        name="information-circle-outline"
                        size={22}
                        color={AppColors.textSecondary}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {step === 4 && (
          <View style={styles.card}>
            {/* Header Row */}
            <View style={styles.modelHeaderRow}>
              {/* <FieldLabel text="Select Model" /> */}

              {/* Use your existing dropdown component */}
              <View style={{ width: 110 }}>
                <Dropdown
                  data={modelViewOptions}
                  labelField="label"
                  valueField="value"
                  value={modelViewMode}
                  onChange={(item) => setModelViewMode(item.value)}
                  placeholder="View"
                  style={styles.dropdown}
                />
              </View>
            </View>

            <FlatList
              key={modelViewMode} // 👈 IMPORTANT (forces re-render layout)
              data={models}
              keyExtractor={(item) => item.id}
              numColumns={modelViewMode === '1' ? 1 : 2}
              scrollEnabled={false}
              columnWrapperStyle={
                modelViewMode === '2'
                  ? {
                      justifyContent: 'space-between',
                      marginBottom: verticalScale(12),
                    }
                  : undefined
              }
              contentContainerStyle={{
                marginTop: verticalScale(10),
              }}
              renderItem={({ item }) => {
                const selected = item.id === selectedModelId;

                return (
                  <View
                    style={{
                      width: modelViewMode === '1' ? '100%' : '48%',
                      marginBottom: verticalScale(12),
                    }}
                  >
                    <ModelCard
                      image={item.image}
                      name={item.name}
                      height={item.height}
                      selected={selected}
                      onPress={() => setSelectedModelId(item.id)}
                      primaryColor={AppColors.primary}
                      borderColor={AppColors.border}
                      textColor={AppColors.textPrimary}
                      mutedColor={AppColors.textSecondary}
                    />
                  </View>
                );
              }}
            />
          </View>
        )}

        {step === 5 && (
          <View style={styles.card}>
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
          </View>
        )}

        {step === 6 && (
          <View style={styles.card}>
            <CustomText
              weight="extraBold"
              style={[styles.summaryTitle, { color: AppColors.textPrimary }]}
            >
              Order Summary
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
                    South Indian Style Wedding
                  </CustomText>
                  <View style={styles.badge}>
                    <CustomText
                      weight="bold"
                      style={{
                        fontSize: 12,
                        color: AppColors.textPrimary,
                      }}
                    >
                      Booked
                    </CustomText>
                  </View>
                </View>
                <CustomText
                  style={{ marginTop: 6, color: AppColors.textSecondary }}
                >
                  Date & Time: 24 April, 2023, 10:00 PM
                </CustomText>
                <CustomText
                  style={{ marginTop: 4, color: AppColors.textSecondary }}
                >
                  Event Venue: Lock Stock & Barrel, Dubai
                </CustomText>
                <CustomText
                  style={{ marginTop: 4, color: AppColors.textSecondary }}
                >
                  Total Staff: {staff}
                </CustomText>
              </View>
            </View>

            <View style={{ marginTop: verticalScale(12) }}>
              <CustomText
                style={[styles.summaryTitle, { color: AppColors.textPrimary }]}
              >
                Billing Details
              </CustomText>

              <RowKV
                k="Total Price"
                v="₹65,555.99"
              />
              <RowKV
                k="Payable Price now:"
                v="₹10,000.00"
              />
              <RowKV
                k="Remaining"
                v="₹10,000.00"
              />
              <RowKV
                k="Grand Total"
                v="₹75,000.00"
                bold
              />
            </View>
          </View>
        )}

        {step === 7 && (
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
                label="Paytm UPI"
                selected={payment === 'Paytm'}
                onPress={() => setPayment('Paytm')}
              />
              <RadioRow
                label="PhonePe"
                selected={payment === 'PhonePe'}
                onPress={() => setPayment('PhonePe')}
              />
              <RadioRow
                label="GPay"
                selected={payment === 'GPay'}
                onPress={() => setPayment('GPay')}
              />
              <RadioRow
                label="Cards"
                selected={payment === 'Card'}
                onPress={() => setPayment('Card')}
              />
              <RadioRow
                label="Cash"
                selected={payment === 'Cash'}
                onPress={() => setPayment('Cash')}
              />
            </View>
          </View>
        )}

        {step === 8 && (
          <View style={styles.card}>
            <View
              style={{
                alignItems: 'center',
                paddingVertical: verticalScale(14),
              }}
            >
              <View
                style={[styles.checkCircle, { borderColor: AppColors.primary }]}
              >
                <Ionicons
                  name="checkmark"
                  size={26}
                  color={AppColors.primary}
                />
              </View>
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
                v={payment ?? '-'}
              />
              <RowKV
                k="Total Amount"
                v="₹749"
              />
              <RowKV
                k="Pay Date"
                v="Apr 10, 2022"
              />
              <RowKV
                k="Pay Time"
                v="10:45 AM"
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
            </View>
          </View>
        )}

        <View style={{ height: verticalScale(16) }} />
      </ScrollView>

      {/* Bottom Button */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: AppColors.background,
            borderTopColor: AppColors.border,
          },
        ]}
      >
        {step === 6 ? (
          <TouchableOpacity
            onPress={onGoHome}
            activeOpacity={0.9}
            style={[styles.cta, { backgroundColor: AppColors.primary }]}
          >
            <CustomText
              weight="extraBold"
              style={styles.ctaText}
            >
              Go to Home
            </CustomText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onNext}
            activeOpacity={0.9}
            style={[
              styles.cta,
              {
                backgroundColor:
                  (step === 0 && (!eventAbout.trim() || !venue.trim())) ||
                  (step === 1 && !selectedThemeId) ||
                  (step === 2 && !selectedUniformId) ||
                  (step === 3 && !selectedPackageId) ||
                  (step === 6 && !payment)
                    ? AppColors.disabled
                    : AppColors.primary,
              },
            ]}
          >
            <CustomText
              weight="extraBold"
              style={styles.ctaText}
            >
              {step === 4
                ? payLabel
                : step === 5
                  ? payLabel
                  : 'Proceed to Next Step'}
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
      <DateTimePickerModal
        isVisible={pickerVisible}
        mode={pickerMode}
        onConfirm={handleConfirm}
        onCancel={hidePicker}
      />

      <Modal
        isVisible={isPackageInfoVisible}
        onBackdropPress={() => setIsPackageInfoVisible(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View
          style={{
            backgroundColor: AppColors.card,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: scale(16),
            minHeight: verticalScale(250),
          }}
        >
          {/* Drag Handle */}
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: AppColors.divider,
              borderRadius: 2,
              alignSelf: 'center',
              marginBottom: 12,
            }}
          />

          <CustomText
            weight="extraBold"
            style={{
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            {details?.title}
          </CustomText>

          <CustomText
            style={{ color: AppColors.textSecondary, lineHeight: 22 }}
          >
            {details?.description}
          </CustomText>

          <TouchableOpacity
            onPress={() => setIsPackageInfoVisible(false)}
            style={{
              marginTop: 'auto',
              backgroundColor: AppColors.primary,
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <CustomText
              weight="bold"
              style={{ color: AppColors.textInverse }}
            >
              Close
            </CustomText>
          </TouchableOpacity>
        </View>
      </Modal>
    </BaseContainer>
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
