import React from 'react';
import { render, screen } from '@testing-library/react';
import AppStudent from './App-Student';

test('renders learn react link', () => {
  render(<AppStudent />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('updating lock works', () =>{
  render(<AppStudent />);
  //jest.mock()
})