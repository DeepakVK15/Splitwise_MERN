import { screen, render } from "@testing-library/react";
import Activity from "../components/RecentActivities/RecentActivities";
import store from "../store.js";
import { Provider } from 'react-redux';

it("test Recent Activity page", () => {
  console.error = jest.fn();
  render(<Provider store={store}><Activity /></Provider>);
  const activity = screen.getByText(/Recent activity/);
  const groupDropdown = screen.getByText(/Select a group.../);
  const sortbyDropDown = screen.getByText(/Sort By Date/);
  expect(groupDropdown).toBeInTheDocument();
  expect(sortbyDropDown).toBeInTheDocument();
  expect(activity).toBeInTheDocument();
});