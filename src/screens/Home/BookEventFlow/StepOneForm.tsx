import { View, TouchableOpacity, TextInput } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Dropdown } from 'react-native-element-dropdown';
import CustomText from '../../../components/CustomText';

type Props = {
  //   styles: any;
  stateOptions: any[];
  cityOptions: any[];
  selectedState: string | null;
  selectedCity: string | null;
  setSelectedState: (val: string) => void;
  setSelectedCity: (val: string) => void;
  eventAbout: string;
  setEventAbout: (val: string) => void;
  venue: string;
  setVenue: (val: string) => void;
  staff: string;
  setStaff: (val: string) => void;
  days: string;
  setDays: (val: string) => void;
  startDate: Date;
  endDate: Date;
  formatDate: (d: Date) => string;
  formatTime: (d: Date) => string;
  showPicker: (
    field: 'startDate' | 'startTime' | 'endDate' | 'endTime',
    mode: 'date' | 'time',
  ) => void;
};

export default function StepOneForm({
  //   styles,
  stateOptions,
  cityOptions,
  selectedState,
  selectedCity,
  setSelectedState,
  setSelectedCity,
  eventAbout,
  setEventAbout,
  venue,
  setVenue,
  staff,
  setStaff,
  days,
  setDays,
  startDate,
  endDate,
  formatDate,
  formatTime,
  showPicker,
}: Props) {
  return (
    <View style={styles.card}>
      {/* State Dropdown */}
      <CustomText
        weight="bold"
        style={styles.label}
      >
        Select State
      </CustomText>
      <Dropdown
        style={styles.dropdown}
        data={stateOptions}
        labelField="label"
        valueField="value"
        value={selectedState}
        onChange={(item) => {
          setSelectedState(item.value);
          setSelectedCity(null);
        }}
      />

      {/* City Dropdown */}
      <CustomText
        weight="bold"
        style={styles.label}
      >
        Select City
      </CustomText>
      <Dropdown
        style={[styles.dropdown, { opacity: selectedState ? 1 : 0.5 }]}
        data={cityOptions}
        labelField="label"
        valueField="value"
        value={selectedCity}
        disable={!selectedState}
        onChange={(item) => setSelectedCity(item.value)}
      />

      {/* Event */}
      <CustomText
        weight="bold"
        style={styles.label}
      >
        Enter The Event Name
      </CustomText>
      <TextInput
        value={eventAbout}
        onChangeText={setEventAbout}
        style={styles.input}
        placeholder="Enter your event "
        placeholderTextColor={AppColors.textGrey}
      />

      {/* Venue */}
      <CustomText
        weight="bold"
        style={styles.label}
      >
        Select a Venue
      </CustomText>
      <TextInput
        value={venue}
        onChangeText={setVenue}
        style={styles.input}
        placeholder="Enter your event Address"
        placeholderTextColor={AppColors.textGrey}
      />

      {/* Staff & Days */}
      <CustomText
        weight="bold"
        style={styles.label}
      >
        Crew Count
      </CustomText>
      <View style={{ flexDirection: 'row', gap: scale(10) }}>
        <TextInput
          value={staff}
          onChangeText={setStaff}
          keyboardType="number-pad"
          style={[styles.input, { flex: 1 }]}
          placeholderTextColor={AppColors.textGrey}
        />
      </View>

      <CustomText
        weight="bold"
        style={styles.label}
      >
        Number Of Days
      </CustomText>
      <View style={{ flexDirection: 'row', gap: scale(10) }}>
        <TextInput
          value={staff}
          onChangeText={setStaff}
          keyboardType="number-pad"
          style={[styles.input, { flex: 1 }]}
          placeholderTextColor={AppColors.textGrey}
        />
      </View>

      {/* Date & Time */}
      <CustomText
        weight="bold"
        style={styles.label}
      >
        Event Start and end date.
      </CustomText>

      <View style={{ gap: verticalScale(10) }}>
        <View style={{ flexDirection: 'row', gap: scale(10) }}>
          <TouchableOpacity
            style={[styles.input, { flex: 1 }]}
            onPress={() => showPicker('startDate', 'date')}
          >
            <CustomText>{formatDate(startDate)}</CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.input, { width: scale(110) }]}
            onPress={() => showPicker('startTime', 'time')}
          >
            <CustomText>{formatTime(startDate)}</CustomText>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', gap: scale(10) }}>
          <TouchableOpacity
            style={[styles.input, { flex: 1 }]}
            onPress={() => showPicker('endDate', 'date')}
          >
            <CustomText>{formatDate(endDate)}</CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.input, { width: scale(110) }]}
            onPress={() => showPicker('endTime', 'time')}
          >
            <CustomText>{formatTime(endDate)}</CustomText>
          </TouchableOpacity>
        </View>
      </View>

      <CustomText
        weight="bold"
        style={styles.label}
      >
        Working Hours
      </CustomText>
      <View style={{ flexDirection: 'row', gap: scale(10) }}>
        <TextInput
          value={staff}
          onChangeText={setStaff}
          keyboardType="number-pad"
          style={[styles.input, { flex: 1 }]}
          placeholderTextColor={AppColors.textGrey}
        />
      </View>
    </View>
  );
}

import { StyleSheet } from 'react-native';
import { Fonts } from '../../../theme/fonts';
import { AppColors } from '../../../theme/colors';

const styles = StyleSheet.create({
  card: {
    backgroundColor: AppColors.card,
    borderRadius: scale(12),
    padding: scale(12),
    borderWidth: scale(1),
    borderColor: AppColors.border,
  },
  label: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(6),
    color: AppColors.textPrimary,
  },
  dropdown: {
    borderWidth: moderateScale(1),
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    borderRadius: scale(10),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(12),
  },
  input: {
    borderWidth: scale(1),
    borderColor: AppColors.border,
    backgroundColor: AppColors.surface,
    borderRadius: scale(10),
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
    color: AppColors.textPrimary,
    fontFamily: Fonts.medium,
  },
});
