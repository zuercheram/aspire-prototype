import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { ScrollTable } from "./ScrollTable";
import { ColumnDefinition } from "./ColumnDefinition";
import { NumberContentConfig } from "./ContentConfig";

interface TestData {
  number: number;
}

const testNumber = 12.8392092;

const testData: TestData[] = [{ number: testNumber }];

const baseColumnDefinition: ColumnDefinition<TestData> = {
  accessor: "number",
  header: "number",
  id: "number",
  contentConfig: { type: "number" },
};

const renderTableWithDecimalsAndGetCell = (
  decimals: number | undefined = undefined
) => {
  render(
    <MemoryRouter>
      <ScrollTable
        data={testData}
        columnDefinitions={[
          {
            ...baseColumnDefinition,
            contentConfig: {
              ...(baseColumnDefinition.contentConfig as NumberContentConfig),
              decimals,
            },
          },
        ]}
        title="Numbers"
      />
    </MemoryRouter>
  );
};

describe("ScrollTable with Numbers column", () => {
  beforeAll(() => {
    i18next.use(initReactI18next).init({
      lng: "de",
    });
  });
  it("renders numbers fully if no decimals are passed", async () => {
    renderTableWithDecimalsAndGetCell();
    await waitFor(() => {
      const cell = screen.getByRole("gridcell")
      expect(cell).toBeDefined();
      expect(cell.textContent).toBe(String(testNumber));
    });
  });

  it("renders numbers with two decimals configured that way", async () => {
    renderTableWithDecimalsAndGetCell(2);
    await waitFor(() => {
      const cell = screen.getByRole("gridcell")
      expect(cell).toBeDefined();
      expect(cell.textContent).toBe("12.84");
    });
  });

  it("renders numbers as integers if 0 decimals are passed", async () => {
    renderTableWithDecimalsAndGetCell(0);
    await waitFor(() => {
      const cell = screen.getByRole("gridcell")
      expect(cell).toBeDefined();
      expect(cell.textContent).toBe("13");
    });
  });
});
