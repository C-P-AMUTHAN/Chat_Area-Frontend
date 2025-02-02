import { Star } from "lucide-react";

const RatingStars = ({ rating = 5 }) => {
  return (
    <div className="flex gap-1 text-yellow-500">
      {[...Array(5)].map((_, index) => (
        <Star key={index} size={16} fill={index < rating ? "#FFD700" : "none"} stroke="currentColor" />
      ))}
    </div>
  );
};

export default RatingStars;
