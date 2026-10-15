/** Renders a movie's first three reviews with independent query recovery. */
import type { MovieReviewsResponse } from '../../../api/types';
import { DetailSection } from './DetailSection';
import { ReviewCard } from '../ReviewCard';

interface ReviewsSectionProps {
  reviews?: MovieReviewsResponse;
  isLoading: boolean;
  errorMessage?: string;
  onRetry: () => void;
}

export function ReviewsSection({
  reviews,
  isLoading,
  errorMessage,
  onRetry,
}: ReviewsSectionProps) {
  const visibleReviews = reviews?.results.slice(0, 3) ?? [];

  return (
    <DetailSection
      title="Reviews"
      isLoading={isLoading}
      errorMessage={errorMessage}
      onRetry={onRetry}
      hasData={Boolean(reviews)}
      isEmpty={visibleReviews.length === 0}
    >
      {visibleReviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </DetailSection>
  );
}
