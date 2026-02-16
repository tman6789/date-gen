
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DateCard from './DateCard';

const mockDate = {
    title: "Test Date",
    steps: ["Step 1", "Step 2"],
    time: "2 hours",
    budget: "$$",
    bestTime: "Evening",
    setting: "Indoor",
    why: "Because it's fun"
};

describe('DateCard Component', () => {
    it('renders date details correctly', () => {
        render(<DateCard date={mockDate} />);

        expect(screen.getByText('Test Date')).toBeInTheDocument();
        expect(screen.getByText('Step 1')).toBeInTheDocument();
        expect(screen.getByText(/Because it's fun/)).toBeInTheDocument();
        expect(screen.getByText(content => content.includes('2 hours'))).toBeInTheDocument();
    });

    it('calls onFavorite when heart is clicked', () => {
        const handleFavorite = vi.fn();
        render(<DateCard date={mockDate} onFavorite={handleFavorite} />);

        const favButton = screen.getByTitle('Save to favorites');
        fireEvent.click(favButton);
        expect(handleFavorite).toHaveBeenCalledTimes(1);
    });

    it('shows filled heart when favorited', () => {
        render(<DateCard date={mockDate} isFavorited={true} />);
        expect(screen.getByText('💜')).toBeInTheDocument();
    });
});
