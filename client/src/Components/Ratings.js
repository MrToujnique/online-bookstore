import { Rating } from "@mui/material";

export default function Ratings(props) {
  const { rating, numReviews, caption } = props;
  return (
    <div>
      <span>
        <Rating
          name="half-rating"
          defaultValue={0}
          value={rating}
          precision={0.5}
          readOnly
        />
      </span>
      {caption ? (
        <span>{caption}</span>
      ) : (
        <span>{numReviews + " recenzji"}</span>
      )}
    </div>
  );
}
