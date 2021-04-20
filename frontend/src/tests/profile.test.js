import { screen, render, fireEvent } from "@testing-library/react";
import Profile from "../components/Profile/Profile";
import store from "../store.js";
import { Provider } from 'react-redux';

it("test Profile page", () => {
  console.error = jest.fn();

  render(<Provider store={store}><Profile /></Provider>);
  const email = screen.getByTestId("email");
  const phone = screen.getByTestId("phone");

  const name = screen.getByTestId("name");

  fireEvent.change(email, { target: { value: "test@splitwise.com" } });
  fireEvent.change(phone, { target: { value: "6665554444" } });

  fireEvent.change(name, { target: { value: "test" } });

  expect(email.value).toBe("test@splitwise.com");
  expect(name.value).toBe("test");
  expect(phone.value).toBe("6665554444");
});