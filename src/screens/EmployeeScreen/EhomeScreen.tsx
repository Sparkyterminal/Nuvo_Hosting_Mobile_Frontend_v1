import { View, StyleSheet, Image, ScrollView, FlatList } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BaseContainer } from '../../components/BaseContainer';
import CustomText from '../../components/CustomText';
import { AppColors } from '../../theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useEffect, useState } from 'react';
import {
  fetchCompletedEvents,
  fetchUpcomingEvents,
} from '../../features/staff/staffSlice';

const myEvents = [
  {
    id: '1',
    title: 'North Indian Haladi',
    date: '12 April, 2020. 10:00 PM',
    venue: 'Lock Stock & Barrel. Dubai',
    image:
      'https://images.unsplash.com/photo-1608889175123-8ee362c4b1c0?q=80&w=800&auto=format&fit=crop',
    status: 'Assigned',
  },
  {
    id: '2',
    title: 'South Indian Wedding',
    date: '24 April, 2023. 10:00 PM',
    venue: 'Grand Palace. Bangalore',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    status: 'Assigned',
  },
  {
    id: '3',
    title: 'Mehendi Ceremony',
    date: '02 May, 2024. 04:00 PM',
    venue: 'Royal Orchid. Mysore',
    image:
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=800&auto=format&fit=crop',
    status: 'Assigned',
  },
  {
    id: '4',
    title: 'Engagement Party',
    date: '10 May, 2024. 07:30 PM',
    venue: 'Leela Palace. Chennai',
    image:
      'https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=800&auto=format&fit=crop',
    status: 'Assigned',
  },
  {
    id: '5',
    title: 'Cocktail Night',
    date: '18 May, 2024. 09:00 PM',
    venue: 'JW Marriott. Mumbai',
    image:
      'https://images.unsplash.com/photo-1515169067865-5387ec356754?q=80&w=800&auto=format&fit=crop',
    status: 'Assigned',
  },
  {
    id: '6',
    title: 'Reception Night',
    date: '01 June, 2024. 08:00 PM',
    venue: 'ITC Gardenia. Bangalore',
    image:
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop',
    status: 'Assigned',
  },
  {
    id: '7',
    title: 'Baby Shower Event',
    date: '08 June, 2024. 11:00 AM',
    venue: 'Radisson Blu. Hyderabad',
    image:
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    status: 'Assigned',
  },
  {
    id: '8',
    title: 'Birthday Celebration',
    date: '15 June, 2024. 06:30 PM',
    venue: 'Hilton. Goa',
    image:
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?q=80&w=800&auto=format&fit=crop',
    status: 'Assigned',
  },
  {
    id: '9',
    title: 'Corporate Event',
    date: '22 June, 2024. 10:00 AM',
    venue: 'Sheraton. Pune',
    image:
      'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=800&auto=format&fit=crop',
    status: 'Assigned',
  },
  {
    id: '10',
    title: 'Fashion Show',
    date: '30 June, 2024. 07:00 PM',
    venue: 'Convention Center. Delhi',
    image:
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
    status: 'Assigned',
  },
];

const EmployeeHomeScreen = ({ navigation }: any) => {
  const users = useAppSelector((state) => state.auth.user);

  const dispatch = useAppDispatch();

  const { upcoming, completed } = useAppSelector((state) => state.staff);

  useEffect(() => {
    dispatch(fetchUpcomingEvents());
    dispatch(fetchCompletedEvents());
  }, []);

  console.log('completed === ', completed);

  const renderEvent = ({ item }: any) => {
    return (
      <View style={styles.eventCard}>
        <Image
          source={{ uri: item.image }}
          style={styles.eventImage}
        />

        <View style={{ flex: 1 }}>
          <View style={styles.eventHeaderRow}>
            <CustomText
              weight="bold"
              style={styles.eventTitle}
              numberOfLines={2}
            >
              {item.title}
            </CustomText>

            <View style={styles.badge}>
              <CustomText variant="caption">{item.status}</CustomText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="calendar"
              size={18}
              color={AppColors.primary}
            />
            <View style={{ marginLeft: 8 }}>
              <CustomText
                variant="caption"
                color={AppColors.textSecondary}
              >
                Date & Time
              </CustomText>
              <CustomText>{item.date}</CustomText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={18}
              color={AppColors.primary}
            />
            <View style={{ marginLeft: 8 }}>
              <CustomText
                variant="caption"
                color={AppColors.textSecondary}
              >
                Event Venue
              </CustomText>
              <CustomText>{item.venue}</CustomText>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <BaseContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150' }}
              style={styles.avatar}
            />

            <View style={{ flex: 1 }}>
              <CustomText color={AppColors.textInverse}>Welcome,</CustomText>

              <CustomText
                variant="subtitle"
                weight="bold"
                color={AppColors.textInverse}
              >
                {users?.full_name}
              </CustomText>
            </View>

            <Ionicons
              name="notifications-outline"
              size={24}
              color="#fff"
            />
          </View>
        </View>

        {/* MAP PREVIEW */}
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop',
          }}
          style={styles.map}
        />

        {/* MY EVENTS TITLE */}
        <View style={styles.sectionRow}>
          <CustomText
            weight="bold"
            variant="subtitle"
          >
            My Events
          </CustomText>

          <CustomText
            variant="caption"
            weight="medium"
            style={styles.historyLink}
            onPress={() => navigation.navigate('EventHistory')}
          >
            View History
          </CustomText>
        </View>
        {/* EVENT CARD (temporary simple) */}

        <FlatList
          data={myEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          contentContainerStyle={{ paddingBottom: verticalScale(80) }}
          scrollEnabled={false}
        />

        <View style={{ height: verticalScale(80) }} />
      </ScrollView>
    </BaseContainer>
  );
};

export default EmployeeHomeScreen;

const styles = StyleSheet.create({
  header: {
    backgroundColor: AppColors.primary,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  avatar: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
  },
  map: {
    width: '100%',
    height: verticalScale(220),
  },
  sectionTitle: {
    marginTop: verticalScale(16),
    marginHorizontal: scale(16),
  },
  card: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(12),
    padding: scale(14),
    borderRadius: moderateScale(14),
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
  },

  eventCard: {
    flexDirection: 'row',
    marginHorizontal: scale(16),
    marginTop: verticalScale(12),
    padding: scale(12),
    borderRadius: moderateScale(14),
    backgroundColor: AppColors.card,
    borderWidth: 1,
    borderColor: AppColors.border,
  },

  eventImage: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(10),
    marginRight: scale(10),
  },

  eventHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },

  badge: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(6),
  },
  eventTitle: {
    flex: 1,
    marginRight: scale(8),
  },

  sectionRow: {
    marginTop: verticalScale(16),
    marginHorizontal: scale(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  historyLink: {
    color: AppColors.primary,
  },
});
