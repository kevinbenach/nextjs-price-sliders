import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Range } from './Range';

describe('Range Component', () => {
  describe('Normal Mode', () => {
    it('should render with correct initial values', () => {
      render(<Range mode="normal" min={0} max={100} />);

      const container = screen.getByTestId('range-container');
      expect(container).toBeInTheDocument();

      expect(screen.getByText('0.00€')).toBeInTheDocument();
      expect(screen.getByText('100.00€')).toBeInTheDocument();
    });

    it('should render with custom initial values', () => {
      render(
        <Range
          mode="normal"
          min={0}
          max={100}
          initialMinValue={25}
          initialMaxValue={75}
        />
      );

      expect(screen.getByText('25.00€')).toBeInTheDocument();
      expect(screen.getByText('75.00€')).toBeInTheDocument();
    });

    it('should have two draggable handles', () => {
      render(<Range mode="normal" min={0} max={100} />);

      const minHandle = screen.getByTestId('range-handle-min');
      const maxHandle = screen.getByTestId('range-handle-max');

      expect(minHandle).toBeInTheDocument();
      expect(maxHandle).toBeInTheDocument();
      expect(minHandle).toHaveAttribute('role', 'slider');
      expect(maxHandle).toHaveAttribute('role', 'slider');
    });

    it('should have correct ARIA attributes', () => {
      render(<Range mode="normal" min={0} max={100} />);

      const minHandle = screen.getByTestId('range-handle-min');
      const maxHandle = screen.getByTestId('range-handle-max');

      expect(minHandle).toHaveAttribute('aria-label', 'Minimum value handle');
      expect(minHandle).toHaveAttribute('aria-valuemin', '0');
      expect(minHandle).toHaveAttribute('aria-valuemax', '100');
      expect(minHandle).toHaveAttribute('aria-valuenow', '0');

      expect(maxHandle).toHaveAttribute('aria-label', 'Maximum value handle');
      expect(maxHandle).toHaveAttribute('aria-valuemin', '0');
      expect(maxHandle).toHaveAttribute('aria-valuemax', '100');
      expect(maxHandle).toHaveAttribute('aria-valuenow', '100');
    });

    it('should call onChange when values change', async () => {
      const handleChange = vi.fn();
      render(<Range mode="normal" min={0} max={100} onChange={handleChange} />);

    
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalledWith({ min: 0, max: 100 });
      });
    });

    it('should make labels editable in normal mode', async () => {
      const user = userEvent.setup();
      render(<Range mode="normal" min={0} max={100} />);

      const minLabel = screen.getByLabelText(/Minimum value: 0.00€/);

      await user.click(minLabel);

      const input = screen.getByLabelText('Minimum value input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(0);
    });

    it('should update value when editing label', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(<Range mode="normal" min={0} max={100} onChange={handleChange} />);

      const minLabel = screen.getByLabelText(/Minimum value: 0.00€/);

      await user.click(minLabel);

      const input = screen.getByLabelText('Minimum value input');

      await user.clear(input);
      await user.type(input, '25');

      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('25.00€')).toBeInTheDocument();
      });
    });

    it('should not allow min value to exceed max value', async () => {
      const user = userEvent.setup();
      render(
        <Range
          mode="normal"
          min={0}
          max={100}
          initialMinValue={25}
          initialMaxValue={50}
        />
      );

      const minLabel = screen.getByLabelText(/Minimum value: 25.00€/);

  
      await user.click(minLabel);
      const input = screen.getByLabelText('Minimum value input');
      await user.clear(input);
      await user.type(input, '75');
      await user.tab();

      await waitFor(() => {
        const minValue = screen.getByLabelText(/Minimum value: 49.00€/);
        const maxValue = screen.getByLabelText(/Maximum value: 50.00€/);
        expect(minValue).toBeInTheDocument();
        expect(maxValue).toBeInTheDocument();
      });
    });

    it('should close input on Escape key', async () => {
      const user = userEvent.setup();
      render(<Range mode="normal" min={0} max={100} />);

      const minLabel = screen.getByLabelText(/Minimum value: 0.00€/);

      await user.click(minLabel);
      const input = screen.getByLabelText('Minimum value input');

      await user.type(input, '50');
      await user.keyboard('{Escape}');

      expect(screen.queryByLabelText('Minimum value input')).not.toBeInTheDocument();
      expect(screen.getByText('0.00€')).toBeInTheDocument();
    });

    it('should save input on Enter key', async () => {
      const user = userEvent.setup();
      render(<Range mode="normal" min={0} max={100} />);

      const minLabel = screen.getByLabelText(/Minimum value: 0.00€/);

      await user.click(minLabel);
      const input = screen.getByLabelText('Minimum value input');

      await user.clear(input);
      await user.type(input, '30{Enter}');

      await waitFor(() => {
        expect(screen.getByText('30.00€')).toBeInTheDocument();
      });
    });

    it('should respect step value when provided', () => {
      render(<Range mode="normal" min={0} max={100} step={5} />);

      const minHandle = screen.getByTestId('range-handle-min');
      expect(minHandle).toBeInTheDocument();

    });
  });

  describe('Fixed Mode', () => {
    const fixedValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];

    it('should render with fixed values', () => {
      render(<Range mode="fixed" values={fixedValues} />);

      expect(screen.getByText('1.99€')).toBeInTheDocument();
      expect(screen.getByText('70.99€')).toBeInTheDocument();
    });

    it('should initialize with custom indices', () => {
      render(
        <Range
          mode="fixed"
          values={fixedValues}
          initialMinIndex={1}
          initialMaxIndex={4}
        />
      );

      expect(screen.getByText('5.99€')).toBeInTheDocument();
      expect(screen.getByText('50.99€')).toBeInTheDocument();
    });

    it('should NOT make labels editable in fixed mode', async () => {
      const user = userEvent.setup();
      render(<Range mode="fixed" values={fixedValues} />);

      const minLabel = screen.getByLabelText(/Minimum value: 1.99€/);

      await user.click(minLabel);

      const input = screen.queryByLabelText('Minimum value input');
      expect(input).not.toBeInTheDocument();
    });

    it('should have correct ARIA values for fixed mode', () => {
      render(<Range mode="fixed" values={fixedValues} />);

      const minHandle = screen.getByTestId('range-handle-min');
      const maxHandle = screen.getByTestId('range-handle-max');

      expect(minHandle).toHaveAttribute('aria-valuemin', '1.99');
      expect(minHandle).toHaveAttribute('aria-valuemax', '70.99');
      expect(minHandle).toHaveAttribute('aria-valuenow', '1.99');

      expect(maxHandle).toHaveAttribute('aria-valuemin', '1.99');
      expect(maxHandle).toHaveAttribute('aria-valuemax', '70.99');
      expect(maxHandle).toHaveAttribute('aria-valuenow', '70.99');
    });
  });

  describe('Visual Elements', () => {
    it('should render track with active range', () => {
      render(<Range mode="normal" min={0} max={100} />);

      const track = screen.getByTestId('range-track');
      const activeTrack = screen.getByTestId('range-track-active');

      expect(track).toBeInTheDocument();
      expect(activeTrack).toBeInTheDocument();
    });

    it('should position handles correctly', () => {
      render(
        <Range
          mode="normal"
          min={0}
          max={100}
          initialMinValue={25}
          initialMaxValue={75}
        />
      );

      const minHandle = screen.getByTestId('range-handle-min');
      const maxHandle = screen.getByTestId('range-handle-max');

      expect(minHandle).toHaveStyle({ left: '25%' });
      expect(maxHandle).toHaveStyle({ left: '75%' });
    });

    it('should position active track correctly', () => {
      render(
        <Range
          mode="normal"
          min={0}
          max={100}
          initialMinValue={25}
          initialMaxValue={75}
        />
      );

      const activeTrack = screen.getByTestId('range-track-active');

      expect(activeTrack).toHaveStyle({
        left: '25%',
        width: '50%',
      });
    });
  });

  describe('Custom Currency', () => {
    it('should use custom currency symbol', () => {
      render(<Range mode="normal" min={0} max={100} currency="$" />);

      expect(screen.getByText('0.00$')).toBeInTheDocument();
      expect(screen.getByText('100.00$')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have keyboard focusable handles', () => {
      render(<Range mode="normal" min={0} max={100} />);

      const minHandle = screen.getByTestId('range-handle-min');
      const maxHandle = screen.getByTestId('range-handle-max');

      expect(minHandle).toHaveAttribute('tabIndex', '0');
      expect(maxHandle).toHaveAttribute('tabIndex', '0');
    });

    it('should have keyboard focusable labels in normal mode', () => {
      render(<Range mode="normal" min={0} max={100} />);

      const minLabel = screen.getByLabelText(/Minimum value: 0.00€/);
      const maxLabel = screen.getByLabelText(/Maximum value: 100.00€/);

      expect(minLabel).toHaveAttribute('tabIndex', '0');
      expect(maxLabel).toHaveAttribute('tabIndex', '0');
      expect(minLabel).toHaveAttribute('role', 'button');
      expect(maxLabel).toHaveAttribute('role', 'button');
    });

    it('should not have keyboard focusable labels in fixed mode', () => {
      render(<Range mode="fixed" values={[1, 2, 3, 4, 5]} />);

      const minLabel = screen.getByLabelText(/Minimum value: 1.00€/);

      expect(minLabel).not.toHaveAttribute('role', 'button');
      expect(minLabel).not.toHaveAttribute('tabIndex');
    });
  });
});
