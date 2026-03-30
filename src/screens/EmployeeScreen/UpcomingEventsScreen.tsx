import React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { BaseContainer } from '../../components/BaseContainer';
import ScreenHeader from '../../components/ScreenHeader';
import CustomText from '../../components/CustomText';
import { AppColors } from '../../theme/colors';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '../../store/hooks';

const UpcomingEventsScreen = () => {
  const { upcoming } = useAppSelector((state) => state.staff);

  console.log('upcoming == ', upcoming);

  const renderEvent = ({ item }: any) => {
    return (
      <View style={styles.eventCard}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1774070057056-1d5f8fe04494?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8',
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
            <View style={{ marginLeft: 8 }}>
              <CustomText
                variant="caption"
                color={AppColors.textSecondary}
              >
                working Hours :
              </CustomText>
              <CustomText>{item.working_hours}</CustomText>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <BaseContainer>
      <ScreenHeader title="Events" />

      <CustomText
        weight="bold"
        variant="subtitle"
        style={styles.sectionTitle}
      >
        Up comming events
      </CustomText>

      <FlatList
        data={upcoming}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={{ paddingBottom: verticalScale(80) }}
      />
    </BaseContainer>
  );
};

export default UpcomingEventsScreen;

const styles = StyleSheet.create({
  sectionTitle: {
    marginHorizontal: scale(16),
    marginTop: verticalScale(12),
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: scale(8),
  },

  eventTitle: {
    flex: 1,
    marginRight: scale(8),
  },

  badge: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
    alignSelf: 'flex-start',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(6),
  },
});
