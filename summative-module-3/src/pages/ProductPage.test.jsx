/** @vitest-environment jsdom */
import { describe, test, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProductPage from "./ProductPage";

describe("ProductPage Component", () => {
  // 1. Setup mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    // We use window.fetch because we are using the 'jsdom' environment
    window.fetch = vi.fn();
  });

  const mockProducts = [
    { id: 1, name: "Blue Sneakers", price: 50, description: "Cool shoes", image: "blue.jpg" },
    { id: 2, name: "Red Running Shoes", price: 75, description: "Fast shoes", image: "red.jpg" },
    { id: 3, name: "Leather Boots", price: 120, description: "Sturdy boots", image: "boots.jpg" },
  ];

  test("renders loading state initially", () => {
    // Mock fetch to stay pending
    window.fetch.mockImplementationOnce(() => new Promise(() => {}));

    render(<ProductPage />);
    expect(screen.getByText(/loading products.../i)).toBeInTheDocument();
  });

  test("renders all products after successful fetch", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    render(<ProductPage />);

    // Wait for the products to appear
    await waitFor(() => {
      expect(screen.getByText("Blue Sneakers")).toBeInTheDocument();
      expect(screen.getByText("Red Running Shoes")).toBeInTheDocument();
      expect(screen.getByText("Leather Boots")).toBeInTheDocument();
    });
  });

  test("filters products correctly based on search input", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    render(<ProductPage />);

    // Wait for data to load
    await waitFor(() => screen.getByText("Blue Sneakers"));

    const searchInput = screen.getByPlaceholderText(/search products by name.../i);

    // Type "sneakers" into the search bar
    fireEvent.change(searchInput, { target: { value: "sneakers" } });

    // "Blue Sneakers" should remain, others should vanish
    expect(screen.getByText("Blue Sneakers")).toBeInTheDocument();
    expect(screen.queryByText("Red Running Shoes")).not.toBeInTheDocument();
    expect(screen.queryByText("Leather Boots")).not.toBeInTheDocument();
  });

  test("shows 'no products found' message if search matches nothing", async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProducts,
    });

    render(<ProductPage />);

    await waitFor(() => screen.getByText("Blue Sneakers"));

    const searchInput = screen.getByPlaceholderText(/search products by name.../i);

    // Type something that doesn't exist
    fireEvent.change(searchInput, { target: { value: "NonExistentItem" } });

    expect(screen.getByText(/no products found matching "NonExistentItem"/i)).toBeInTheDocument();
    expect(screen.queryByText("Blue Sneakers")).not.toBeInTheDocument();
  });
});