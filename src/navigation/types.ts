/** Route parameter contracts shared by navigators and screen implementations. */
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Explore: undefined;
  TV: undefined;
  Watchlist: undefined;
};

export type SeeAllCategory = 'nowPlaying' | 'popular' | 'topRated' | 'upcoming';

export type RootStackParamList = {
  Tabs: undefined;
  MovieDetails: { movieId: number };
  PersonDetails: { personId: number };
  TvDetails: { seriesId: number };
  SeeAll: { category: SeeAllCategory; title: string };
  Gallery: { movieId: number; initialIndex?: number };
  About: undefined;
};

export type RootStackScreenProps<RouteName extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, RouteName>;

export type TabScreenProps<RouteName extends keyof TabParamList> = BottomTabScreenProps<
  TabParamList,
  RouteName
>;
