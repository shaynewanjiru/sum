// 1. IMPORT VITEST GLOBALS HERE
/** @vitest-environment jsdom */
import { describe, test, expect, beforeEach, vi } from "vitest"; 

// 2. Import React Testing Library tools
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminForm from "./AdminForm";

// 3. Mock the React Router 'useNavigate' hook
const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom"); // Note: Vitest prefers importActual
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe("AdminForm Component", () => {
  // Clear mocks and fake the window.alert before each test
  beforeEach(() => {
    vi.clearAllMocks();
    window.alert = vi.fn(); 
  });

  test("renders the login form inputs and button correctly", () => {
    // We wrap the component in MemoryRouter because it uses React Router features
    render(
      <MemoryRouter>
        <AdminForm />
      </MemoryRouter>
    );

    // Verify UI elements are on the screen
    expect(screen.getByRole("heading", { name: /Admin Form/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Administrator Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Administrator Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  test("shows an alert and prevents navigation on invalid credentials", () => {
    render(
      <MemoryRouter>
        <AdminForm />
      </MemoryRouter>
    );

    // Simulate user typing wrong info
    fireEvent.change(screen.getByPlaceholderText(/Administrator Name/i), {
      target: { value: "hacker" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Administrator Password/i), {
      target: { value: "wrongpassword123" },
    });

    // Simulate clicking submit
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    // Verify it blocks the user
    expect(window.alert).toHaveBeenCalledWith("Invalid credentials. Please try again.");
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  test("shows success alert and navigates to edit page on valid credentials", () => {
    render(
      <MemoryRouter>
        <AdminForm />
      </MemoryRouter>
    );

    // Simulate user typing correct info
    fireEvent.change(screen.getByPlaceholderText(/Administrator Name/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Administrator Password/i), {
      target: { value: "password" },
    });

    // Simulate clicking submit
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    // Verify successful login behavior
    expect(window.alert).toHaveBeenCalledWith("Login successful!");
    expect(mockedNavigate).toHaveBeenCalledWith("/admin/edit/1", { replace: true });
  });
});