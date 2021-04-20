import { screen, render } from "@testing-library/react";
import MyGroups from "../components/Group/MyGroups";
import store from "../store.js";
import { Provider } from 'react-redux';

it("test MyGroups page", () => {
  console.error = jest.fn();
  render(<Provider store={store}><MyGroups /></Provider>);
  const mygroups = screen.getByText(/My Groups/);
  const invites = screen.getByText(/Invites/);
  expect(mygroups).toBeInTheDocument();
  expect(invites).toBeInTheDocument();
});