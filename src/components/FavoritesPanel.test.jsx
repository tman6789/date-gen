
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FavoritesPanel from './FavoritesPanel';

const mockFavorites = [
    { title: "Fav 1", steps: [], time: "1h", budget: "$", bestTime: "Any", setting: "Any", why: "Test" },
    { title: "Fav 2", steps: [], time: "2h", budget: "$$", bestTime: "Any", setting: "Any", why: "Test" }
];

describe('FavoritesPanel Component', () => {
    it('renders list of favorites', () => {
        render(<FavoritesPanel favorites={mockFavorites} />);
        expect(screen.getByText('Fav 1')).toBeInTheDocument();
        expect(screen.getByText('Fav 2')).toBeInTheDocument();
    });

    it('renders empty state message when no favorites', () => {
        render(<FavoritesPanel favorites={[]} />);
        expect(screen.getByText(/No saved dates yet/i)).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        const handleClose = vi.fn();
        render(<FavoritesPanel favorites={mockFavorites} onClose={handleClose} />);

        const closeButton = screen.getByText('✕');
        fireEvent.click(closeButton);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('calls onRemove when remove favorite button is clicked', () => {
        const handleRemove = vi.fn();
        render(<FavoritesPanel favorites={mockFavorites} onRemove={handleRemove} />);

        // Find saved heart buttons (DateCard in FavoritesPanel has isFavorited=true)
        const removeButtons = screen.getAllByTitle('Remove from favorites');
        fireEvent.click(removeButtons[0]);

        expect(handleRemove).toHaveBeenCalledWith(0);
    });
});
