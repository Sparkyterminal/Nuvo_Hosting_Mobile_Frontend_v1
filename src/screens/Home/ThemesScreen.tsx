import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { BaseContainer } from '../../components/BaseContainer';
import CustomText from '../../components/CustomText';
import { AppColors } from '../../theme/colors';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import ScreenHeader from '../../components/ScreenHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'Themes'>;

type ThemeCard = {
  id: string;
  title: string;
  description: string;
  image: any;
  color: string;
};

// Ideally: move this THEMES array to a shared file (ex: src/data/themes.ts) and import in both screens
const THEMES: ThemeCard[] = [
  {
    id: '1',
    title: 'South Indian wedding',
    description:
      'Book trained hosts, models, and support staff for any occasion.',
    image: require('../../assets/images/home.jpg'),
    color: '#1E6FB3',
  },
  {
    id: '2',
    title: 'Corporate Event',
    description:
      'Book trained hosts, models, and support staff for any occasion.',
    image: require('../../assets/images/home.jpg'),
    color: '#11A36D',
  },
  {
    id: '3',
    title: 'Haladi',
    description:
      'Book trained hosts, models, and support staff for any occasion.',
    image: require('../../assets/images/home.jpg'),
    color: '#D9921A',
  },
];

const ThemesScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <BaseContainer>
      <ScreenHeader
        title="All Themes"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <FlatList
        data={THEMES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => (
          <View style={{ height: verticalScale(12) }} />
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.card}
            onPress={() => navigation.navigate('ThemeDetails', { theme: item })}
          >
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={[styles.textBox, { backgroundColor: item.color }]}>
              <CustomText
                variant="body"
                weight="bold"
                color={AppColors.textInverse}
              >
                {item.title}
              </CustomText>
              <CustomText
                variant="caption"
                color={AppColors.textInverse}
                style={{ marginTop: 4 }}
              >
                {item.description}
              </CustomText>
            </View>
          </TouchableOpacity>
        )}
      />
    </BaseContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: AppColors.textInverse,
  },
  backBtn: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
  },
  listContent: {
    padding: scale(16),
    paddingBottom: verticalScale(24),
    backgroundColor: AppColors.background,
  },
  card: {
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    backgroundColor: AppColors.card,
    elevation: 3,
    shadowColor: AppColors.textDark,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: verticalScale(2) },
  },
  image: {
    width: '100%',
    height: verticalScale(160),
  },
  textBox: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(12),
  },
});

export default ThemesScreen;
