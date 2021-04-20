import { screen, render, fireEvent } from "@testing-library/react";
import CreateGroup from "../components/Group/CreateGroup";
import store from "../store.js";
import { Provider } from 'react-redux';

it("test CreateGroup page", () => {
  console.error = jest.fn();
  
  render(<Provider store={store}><CreateGroup /></Provider>);
  
  const image = screen.getByAltText("createGrp");
  const groupname = screen.getByTestId("groupname");
  const saveButton = screen.getByText(/Save/);
  fireEvent.change(groupname, { target: { value: "Walmart" } });
  expect(image).toBeInTheDocument();
  expect(groupname.value).toBe("Walmart");
  expect(saveButton).toBeInTheDocument();
});