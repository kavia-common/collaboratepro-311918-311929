import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

test('renders login screen when not authenticated', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );

  const loginHeading = screen.getByText(/login/i);
  expect(loginHeading).toBeInTheDocument();
});
