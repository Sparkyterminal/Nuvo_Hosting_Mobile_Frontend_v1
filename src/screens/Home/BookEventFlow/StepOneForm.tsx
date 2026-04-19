import { View, TouchableOpacity, TextInput } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { Dropdown } from 'react-native-element-dropdown';
import CustomText from '../../../components/CustomText';

type Props = {
  eventType: string | null;
  setEventType: (val: string) => void;
  eventTypeOptions: { label: string; value: string }[];

  // existing props...
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
  setVenueDetails: any;
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
  eventType,
  eventTypeOptions,
  setEventType,
  setVenueDetails,
}: Props) {
  // const [eventType, setEventType] = useState<string | null>(null);
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

      <CustomText
        weight="bold"
        style={styles.label}
      >
        Select Event Type
      </CustomText>

      <Dropdown
        style={styles.dropdown}
        data={eventTypeOptions}
        labelField="label"
        valueField="value"
        value={eventType}
        placeholder="Select Event Type"
        onChange={(item) => setEventType(item.value)}
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
      <View style={{ zIndex: 10 }}>
        <GooglePlacesAutocomplete
          placeholder="Search venue"
          fetchDetails={true}
          onFail={(error) => {
            console.log('❌ GOOGLE ERROR:', error);
          }}
          onNotFound={() => {
            console.log('⚠️ NO RESULTS FOUND');
          }}
          onPress={(data, details = null) => {
            console.log('✅ DATA:', data);
            console.log('✅ DETAILS:', details);
          }}
          debounce={300}
          minLength={2}
          enablePoweredByContainer={false}
          keyboardShouldPersistTaps="handled"
          query={{
            key:GOOGLE_MAPS_API_KEY,
            language: 'en',
            components: 'country:in',
          }}
          textInputProps={{
            returnKeyType: 'search',
          }}
          onPress={(data, details = null) => {
            if (!details) {
              console.log('No details found');
              return;
            }

            const location = details?.geometry?.location;
            if (!location) return;

            const components = details.address_components;

            const city =
              components.find((c) => c.types.includes('locality'))?.long_name ||
              components.find((c) =>
                c.types.includes('administrative_area_level_2'),
              )?.long_name;

            const state = components.find((c) =>
              c.types.includes('administrative_area_level_1'),
            )?.long_name;

            setSelectedCity(city);
            setSelectedState(state);
            setVenue(details.formatted_address);

            setVenueDetails({
              venue_name: data.structured_formatting.main_text,
              formatted_address: details.formatted_address,
              latitude: location.lat,
              longitude: location.lng,
              place_id: data.place_id,
            });
          }}
          styles={{
            container: { flex: 0 },
            textInput: {
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              backgroundColor: '#fff',
            },
            listView: {
              backgroundColor: '#fff',
              zIndex: 20,
            },
          }}
        />
      </View>

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
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '../../../app/config/api';

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
