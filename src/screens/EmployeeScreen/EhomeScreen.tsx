import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  Switch,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BaseContainer } from '../../components/BaseContainer';
import CustomText from '../../components/CustomText';
import { AppColors } from '../../theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useEffect, useState } from 'react';
import {
  fetchAssignedEvents,
  fetchCompletedEvents,
  fetchUpcomingEvents,
  setOnlineStatus,
} from '../../features/staff/staffSlice';

const EmployeeHomeScreen = ({ navigation }: any) => {
  const users = useAppSelector((state) => state.auth.user);
  const { assigned, isOnline } = useAppSelector((state) => state.staff);

  const [loadingStatus, setLoadingStatus] = useState(false);
  const [localStatus, setLocalStatus] = useState(isOnline);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUpcomingEvents());
    dispatch(fetchCompletedEvents());
    dispatch(fetchAssignedEvents());
  }, []);

  const renderEvent = ({ item }: any) => {
    return (
      <View style={styles.eventCard}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
          }}
          style={styles.eventImage}
        />

        <View style={{ flex: 1 }}>
          <View style={styles.eventHeaderRow}>
            <CustomText
              weight="bold"
              style={styles.eventTitle}
              numberOfLines={2}
            >
              {item.event_name}
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
              <CustomText>{item.event_start_datetime}</CustomText>
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
              <CustomText>{item.venue.formatted_address}</CustomText>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const handleToggle = (value: boolean) => {
    if (loadingStatus) return;

    setLocalStatus(value);

    setLoadingStatus(true);

    dispatch(setOnlineStatus(value))
      .unwrap()
      .finally(() => setLoadingStatus(false));
  };

  useEffect(() => {
    setLocalStatus(isOnline);
  }, [isOnline]);

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

            <View style={styles.statusRow}>
              <CustomText
                variant="caption"
                color={AppColors.textInverse}
              >
                {isOnline ? 'Online' : 'Offline'}
              </CustomText>

              <Switch
                value={isOnline}
                onValueChange={handleToggle}
                disabled={loadingStatus}
              />
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
          data={assigned}
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(6),
  },
});
