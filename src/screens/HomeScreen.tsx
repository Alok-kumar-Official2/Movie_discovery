/** Home tab: trending feature and four independently loaded movie collections. */
import { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MovieCarousel } from '../components/movie/MovieCarousel';
import { TrendingSection } from '../components/movie/TrendingSection';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { ScreenContainer } from '../components/common/ScreenContainer';
import { useMovieList } from '../hooks/useMovieLists';
import type { RootStackParamList, SeeAllCategory } from '../navigation/types';
import { colors, spacing } from '../theme';
import { getUserErrorMessage } from '../utils/errors';

const SECTIONS: { category: SeeAllCategory; title: string }[] = [
  { category: 'nowPlaying', title: 'Now Playing' },
  { category: 'popular', title: 'Popular' },
  { category: 'topRated', title: 'Top Rated' },
  { category: 'upcoming', title: 'Upcoming' },
];

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const nowPlayingQuery = useMovieList('nowPlaying');
  const popularQuery = useMovieList('popular');
  const topRatedQuery = useMovieList('topRated');
  const upcomingQuery = useMovieList('upcoming');

  const onMoviePress = useCallback(
    (movieId: number) => navigation.navigate('MovieDetails', { movieId }),
    [navigation],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ['movies'] }),
        queryClient.refetchQueries({ queryKey: ['configuration'] }),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient]);

  const sections = [
    { ...SECTIONS[0], query: nowPlayingQuery },
    { ...SECTIONS[1], query: popularQuery },
    { ...SECTIONS[2], query: topRatedQuery },
    { ...SECTIONS[3], query: upcomingQuery },
  ];

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <OfflineBanner />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            colors={[colors.accent]}
            onRefresh={onRefresh}
            refreshing={refreshing}
            tintColor={colors.accent}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <TrendingSection onMoviePress={onMoviePress} />
        {sections.map(({ category, title, query }) => (
          <MovieCarousel
            key={category}
            title={title}
            category={category}
            movies={query.data?.results}
            isLoading={query.isLoading}
            errorMessage={
              query.error
                ? getUserErrorMessage(
                    query.error,
                    'Unable to load this section. Please try again.',
                  )
                : undefined
            }
            onRetry={() => void query.refetch()}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
  },
});
