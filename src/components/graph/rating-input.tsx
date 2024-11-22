import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

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
    <div className="flex flex-col items-start md:items-end mb-2 w-full">
      {isMulti && <p className="text-sm text-slate-500 mb-1">Choose all that apply</p>}
      <div className="flex flex-wrap gap-2 w-full justify-end">
        {ratings.map((rating, i) => (
          <motion.button
            key={rating}
            onClick={() => handleRatingClick(rating)}
            className={`px-3 py-1 rounded-2xl ${
              selectedRatings.includes(rating) ? 'bg-blue-600 text-white' : 'bg-white text-slate-800 hover:bg-slate-300'
            }`}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2, type: 'spring', stiffness: 250, delay: i * 0.1 + 0.1 }}
          >
            {rating}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default RatingInput;
