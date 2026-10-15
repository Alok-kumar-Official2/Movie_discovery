/** Provides the five primary destinations with accessible native tab controls. */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { TabParamList } from './types';
import {
  ExploreScreen,
  HomeScreen,
  SearchScreen,
  TvListScreen,
  WatchlistScreen,
} from '../screens';
import { colors } from '../theme';

const Tab = createBottomTabNavigator<TabParamList>();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size }) => {
          const iconNames = {
            Home: 'home-outline',
            Search: 'search-outline',
            Explore: 'compass-outline',
            TV: 'tv-outline',
            Watchlist: 'bookmark-outline',
          } as const;

          return <Ionicons name={iconNames[route.name]} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="TV" component={TvListScreen} />
      <Tab.Screen name="Watchlist" component={WatchlistScreen} />
    </Tab.Navigator>
  );
}
