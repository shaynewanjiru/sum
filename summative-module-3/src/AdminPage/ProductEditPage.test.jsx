// 1. Import Vitest globals
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductEditPage from "./ProductEditPage";

// 2. Mock React Router hooks
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "1" }), // Pretend we are editing product with ID "1"
    useNavigate: () => mockNavigate,
  };
});

describe("ProductEditPage Component", () => {
  // 3. Setup window mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    window.fetch = vi.fn();
    window.alert = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => {}); 
  });

  afterEach(() => {
    vi.restoreAllMocks(); // This is the safer Vitest way!
  });

  const mockProductData = {
    id: "1",
    name: "Test Shoe",
    price: 99,
    description: "A very nice shoe.",
    image: "shoe.png",
  };

  test("renders loading state initially", () => {
    // Keep fetch pending so we can see the loading text
    window.fetch.mockImplementationOnce(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <ProductEditPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading product...")).toBeInTheDocument();
  });

  test("fetches product data and populates the form", async () => {
    // Mock the initial GET request
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductData,
    });

    render(
      <MemoryRouter>
        <ProductEditPage />
      </MemoryRouter>
    );

    // Wait for the form to appear and check if inputs have the fetched values
    await waitFor(() => {
      expect(screen.getByDisplayValue("Test Shoe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("99")).toBeInTheDocument();
      expect(screen.getByDisplayValue("A very nice shoe.")).toBeInTheDocument();
      expect(screen.getByDisplayValue("shoe.png")).toBeInTheDocument();
    });
  });

  test("handles fetch failure and redirects to admin", async () => {
    // Mock a failed GET request (e.g., 404 Not Found)
    window.fetch.mockResolvedValueOnce({
      ok: false,
    });

    render(
      <MemoryRouter>
        <ProductEditPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Product not found");
      expect(mockNavigate).toHaveBeenCalledWith("/admin");
    });
  });

  test("updates form state when user types", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductData,
    });

    render(
      <MemoryRouter>
        <ProductEditPage />
      </MemoryRouter>
    );

    // Wait for load
    await waitFor(() => screen.getByDisplayValue("Test Shoe"));

    const nameInput = screen.getByPlaceholderText("Product Name");
    
    // Simulate user typing a new name
    fireEvent.change(nameInput, { target: { value: "Updated Shoe", name: "name" } });
    
    expect(nameInput.value).toBe("Updated Shoe");
  });

  test("submits the form successfully and redirects to /products", async () => {
    // Mock GET request (initial load)
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductData,
    });

    render(
      <MemoryRouter>
        <ProductEditPage />
      </MemoryRouter>
    );

    // Wait for load
    await waitFor(() => screen.getByDisplayValue("Test Shoe"));

    // Mock PUT request (form submission)
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockProductData, name: "Updated Shoe" }),
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    // Verify fetch was called with PUT and correct data
    await waitFor(() => {
      expect(window.fetch).toHaveBeenCalledWith("http://localhost:3000/products/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockProductData),
      });
      expect(window.alert).toHaveBeenCalledWith("Product updated successfully!");
      expect(mockNavigate).toHaveBeenCalledWith("/products");
    });
  });

  test("shows an alert if the server update fails", async () => {
    // Mock GET request (initial load)
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProductData,
    });

    render(
      <MemoryRouter>
        <ProductEditPage />
      </MemoryRouter>
    );

    // Wait for load
    await waitFor(() => screen.getByDisplayValue("Test Shoe"));

    // Mock a failed PUT request
    window.fetch.mockResolvedValueOnce({
      ok: false,
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Could not save changes. Is json-server running?");
      // Ensure we don't navigate away if it failed
      expect(mockNavigate).not.toHaveBeenCalledWith("/products");
    });
  });
});