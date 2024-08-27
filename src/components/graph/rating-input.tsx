import React, { useState, useEffect } from 'react';

interface RatingInputProps {
  ratings: string[];
  isMulti: boolean;
  onRatingChange: (selectedRatings: string[]) => void;
}

const RatingInput: React.FC<RatingInputProps> = ({ ratings, isMulti, onRatingChange }) => {
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);

  useEffect(() => {
    onRatingChange(selectedRatings);
  }, [selectedRatings, onRatingChange]);

  const handleRatingClick = (rating: string): void => {
    let newSelectedRatings: string[];
    if (isMulti) {
      newSelectedRatings = selectedRatings.includes(rating)
        ? selectedRatings.filter((r) => r !== rating)
        : [...selectedRatings, rating];
    } else {
      newSelectedRatings = [rating];
    }
    setSelectedRatings(newSelectedRatings);
  };

  return (
    <div className="flex flex-col items-end mb-2">
      {isMulti && <p className="text-sm text-gray-500 mb-1">Choose all that apply</p>}
      <div className="flex space-x-2">
        {ratings.map((rating) => (
          <button
            key={rating}
            onClick={() => handleRatingClick(rating)}
            className={`px-3 py-1 rounded ${
              selectedRatings.includes(rating)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingInput;
