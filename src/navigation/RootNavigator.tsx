/** Owns app-wide stack routes above the five bottom-tab destinations. */
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import {
  GalleryScreen,
  AboutScreen,
  MovieDetailsScreen,
  PersonDetailsScreen,
  SeeAllScreen,
  TvDetailsScreen,
} from '../screens';
import { colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.background,
    card: colors.surface,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.accent,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { color: colors.textPrimary },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="MovieDetails" component={MovieDetailsScreen} />
        <Stack.Screen name="PersonDetails" component={PersonDetailsScreen} />
        <Stack.Screen name="TvDetails" component={TvDetailsScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen
          name="SeeAll"
          component={SeeAllScreen}
          options={({ route }) => ({ title: route.params.title })}
        />
        <Stack.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
