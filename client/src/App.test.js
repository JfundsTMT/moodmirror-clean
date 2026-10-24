import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

jest.mock('react-calendar', () => () => <div data-testid="calendar" />);
jest.mock('react-calendar/dist/Calendar.css', () => ({}), { virtual: true });
jest.mock('react-chartjs-2', () => ({ Line: () => <canvas data-testid="chart" /> }));

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(async () => ({
    ok: true,
    json: async () => ({
      reflection: 'First paragraph.\n\nSecond paragraph.',
      growthScore: 7,
      scoreReason: 'Clear insight.',
    }),
  }));
});

test('submit is disabled until something is written', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /get my reflection/i })).toBeDisabled();
  userEvent.type(screen.getByLabelText('Journal entry'), 'hello');
  expect(screen.getByRole('button', { name: /get my reflection/i })).toBeEnabled();
});

test('write, reflect, save, then see it on the timeline and in trends', async () => {
  render(<App />);
  userEvent.type(screen.getByLabelText('Journal entry'), 'A good day');
  userEvent.click(screen.getByRole('button', { name: /get my reflection/i }));

  expect(await screen.findByText('First paragraph.')).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /growth score 7 out of 10/i })).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: /save to timeline/i }));
  expect(JSON.parse(localStorage.getItem('journalEntries'))).toHaveLength(1);

  userEvent.click(screen.getByRole('button', { name: 'Timeline' }));
  expect(screen.getAllByText('A good day').length).toBeGreaterThan(0);
  expect(screen.getByText('Growth 7')).toBeInTheDocument();

  userEvent.click(screen.getByRole('button', { name: 'Trends' }));
  expect(await screen.findByTestId('chart')).toBeInTheDocument();
});

test('a failed request keeps the writing and shows an error', async () => {
  global.fetch = jest.fn(async () => ({ ok: false, json: async () => ({ error: 'nope' }) }));
  jest.spyOn(console, 'error').mockImplementation(() => {});
  render(<App />);
  userEvent.type(screen.getByLabelText('Journal entry'), 'Keep me');
  userEvent.click(screen.getByRole('button', { name: /get my reflection/i }));

  await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  expect(screen.getByLabelText('Journal entry')).toHaveValue('Keep me');
});

test('saving does not overwrite entries already in storage', async () => {
  localStorage.setItem(
    'journalEntries',
    JSON.stringify([{ timestamp: '2025-01-01T10:00:00.000Z', entry: 'Old entry', mood: 4, energy: 4, sleepQuality: 4 }])
  );
  render(<App />);
  userEvent.type(screen.getByLabelText('Journal entry'), 'New entry');
  userEvent.click(screen.getByRole('button', { name: /get my reflection/i }));
  userEvent.click(await screen.findByRole('button', { name: /save to timeline/i }));
  expect(JSON.parse(localStorage.getItem('journalEntries'))).toHaveLength(2);
});
