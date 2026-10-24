import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-calendar', () => () => <div data-testid="calendar" />);
jest.mock('react-calendar/dist/Calendar.css', () => ({}), { virtual: true });

test('renders the journal with the entry form', () => {
  render(<App />);
  expect(screen.getByText('MoodMirror')).toBeInTheDocument();
  expect(screen.getByLabelText('Journal entry')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
});
