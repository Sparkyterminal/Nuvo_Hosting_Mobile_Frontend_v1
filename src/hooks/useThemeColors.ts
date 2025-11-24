import { AppColors, ThemeColors } from '../theme/colors';

// No light/dark switching – always return the same palette
export const useThemeColors = (): ThemeColors => {
  return AppColors;
};
