import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RangeWrapper } from './RangeWrapper';

describe('RangeWrapper', () => {
  describe('Normal Mode', () => {
    it('should render with Range component in normal mode', () => {
      render(<RangeWrapper mode="normal" min={1} max={100} />);

      // Check Range component rendered
      const container = screen.getByTestId('range-container');
      expect(container).toBeInTheDocument();

      // Check initial values displayed using getAllByText
      const minValues = screen.getAllByText('1.00€');
      const maxValues = screen.getAllByText('100.00€');
      expect(minValues.length).toBeGreaterThan(0);
      expect(maxValues.length).toBeGreaterThan(0);
    });

    it('should display selected range values', () => {
      render(<RangeWrapper mode="normal" min={0} max={100} />);

      // Should show "Selected Range:" label
      expect(screen.getByText('Selected Range:')).toBeInTheDocument();

      // Should show both min and max values
      const values = screen.getAllByText(/0\.00€|100\.00€/);
      expect(values.length).toBeGreaterThan(0);
    });

    it('should initialize with correct values', async () => {
      render(<RangeWrapper mode="normal" min={0} max={100} />);

      // Wait for component to stabilize
      await waitFor(() => {
        // Check that selected values display shows 0.00€ - 100.00€
        const selectedSection = screen.getByText('Selected Range:').parentElement;
        expect(selectedSection).toHaveTextContent('0.00€');
        expect(selectedSection).toHaveTextContent('100.00€');
      });
    });
  });

  describe('Fixed Mode', () => {
    const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

    it('should render with Range component in fixed mode', () => {
      render(<RangeWrapper mode="fixed" values={fixedValues} />);

      const container = screen.getByTestId('range-container');
      expect(container).toBeInTheDocument();

      // Check first and last values displayed (may appear multiple times)
      const minValues = screen.getAllByText('1.99€');
      const maxValues = screen.getAllByText('70.99€');
      expect(minValues.length).toBeGreaterThan(0);
      expect(maxValues.length).toBeGreaterThan(0);
    });

    it('should initialize with first and last values', async () => {
      render(<RangeWrapper mode="fixed" values={fixedValues} />);

      await waitFor(() => {
        const selectedSection = screen.getByText('Selected Range:').parentElement;
        expect(selectedSection).toHaveTextContent('1.99€');
        expect(selectedSection).toHaveTextContent('70.99€');
      });
    });

    it('should handle different value arrays', () => {
      const customValues = [10, 20, 30, 40, 50];
      render(<RangeWrapper mode="fixed" values={customValues} />);

      const minValues = screen.getAllByText('10.00€');
      const maxValues = screen.getAllByText('50.00€');
      expect(minValues.length).toBeGreaterThan(0);
      expect(maxValues.length).toBeGreaterThan(0);
    });
  });

  describe('Selected Values Display', () => {
    it('should format values with 2 decimal places', () => {
      render(<RangeWrapper mode="normal" min={1} max={99} />);

      // Values should be formatted as X.XX€ (may appear multiple times)
      const minValues = screen.getAllByText('1.00€');
      const maxValues = screen.getAllByText('99.00€');
      expect(minValues.length).toBeGreaterThan(0);
      expect(maxValues.length).toBeGreaterThan(0);
    });

    it('should show separator between min and max values', () => {
      render(<RangeWrapper mode="normal" min={0} max={100} />);

      // Should have a separator (dash) between values
      const selectedSection = screen.getByText('Selected Range:').parentElement;
      expect(selectedSection).toHaveTextContent('-');
    });
  });

  describe('Integration with Range', () => {
    it('should pass correct props to Range component in normal mode', () => {
      render(<RangeWrapper mode="normal" min={5} max={95} />);

      // Verify Range received correct props by checking rendered values
      const minValues = screen.getAllByText('5.00€');
      const maxValues = screen.getAllByText('95.00€');
      expect(minValues.length).toBeGreaterThan(0);
      expect(maxValues.length).toBeGreaterThan(0);
    });

    it('should pass correct props to Range component in fixed mode', () => {
      const values = [2.99, 4.99, 6.99];
      render(<RangeWrapper mode="fixed" values={values} />);

      // Verify Range received correct props
      const minValues = screen.getAllByText('2.99€');
      const maxValues = screen.getAllByText('6.99€');
      expect(minValues.length).toBeGreaterThan(0);
      expect(maxValues.length).toBeGreaterThan(0);
    });
  });
});
