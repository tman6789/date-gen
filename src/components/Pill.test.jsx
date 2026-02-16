
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pill from './Pill';

describe('Pill Component', () => {
    it('renders children correctly', () => {
        render(<Pill>Test Pill</Pill>);
        expect(screen.getByText('Test Pill')).toBeInTheDocument();
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(<Pill onClick={handleClick}>Click Me</Pill>);

        fireEvent.click(screen.getByText('Click Me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('applies selected styles', () => {
        render(<Pill selected>Selected</Pill>);
        const pill = screen.getByText('Selected');
        // Check for specific style application (white text on selected)
        expect(pill).toHaveStyle({ color: 'rgb(255, 255, 255)' });
    });
});
