
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock child components to isolate App testing
vi.mock('./components/Pill', () => ({
    default: ({ children, onClick }) => <button onClick={onClick}>{children}</button>
}));
vi.mock('./components/DateCard', () => ({
    default: ({ date }) => <div>{date.title}</div>
}));
vi.mock('./components/FavoritesPanel', () => ({
    default: () => <div>Favorites Panel</div>
}));

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App />);
        expect(screen.getByText(/Spontaneous Date/i)).toBeInTheDocument();
    });

    it('renders location options', () => {
        render(<App />);
        expect(screen.getByText('📍 DC / DMV')).toBeInTheDocument();
        expect(screen.getByText('🌍 Anywhere')).toBeInTheDocument();
    });
});
