import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { ScrollTable } from "./ScrollTable";
import { ColumnDefinition } from "./ColumnDefinition";

interface TestData {
  lookup: string | undefined;
}

const testData = (value: string | undefined): TestData[] => [{ lookup: value }];

const baseColumnDefinition: ColumnDefinition<TestData> = {
  accessor: "lookup",
  header: "lookup",
  id: "lookup",
  contentConfig: {
    type: "lookup",
    inputOutputMap: { "1": "Eins", "2": "Zwei" },
  },
};

const renderTableWithLookupAndGetCell = (
  lookupValue: string | undefined,
  useCustomCellRenderer = false
) => {
  render(
    <MemoryRouter>
      <ScrollTable
        data={testData(lookupValue)}
        columnDefinitions={[
          {
            ...baseColumnDefinition,
            ...(useCustomCellRenderer ? { cell: () => <>{"CUSTOM"}</> } : {}),
          },
        ]}
        title="baseColumnDefs"
      />
    </MemoryRouter>
  );
};

describe("ScrollTable with Lookup column", () => {
  beforeAll(() => {
    i18next.use(initReactI18next).init({
      lng: "de",
    });
  });
  it("renders a correct lookup value", async () => {
    renderTableWithLookupAndGetCell("2");
    await waitFor(() => {
      const cell = screen.getByRole("gridcell");
      expect(cell).toBeDefined();
      expect(cell.textContent).toBe("Zwei");
    });
  });

  it("renders original value if not present in lookup", async () => {
    renderTableWithLookupAndGetCell("3");
    await waitFor(() => {
      const cell = screen.getByRole("gridcell");
      expect(cell).toBeDefined();
      expect(cell.textContent).toBe("3");
    });
  });

  it("renders empty value if nullish value is passed", async () => {
    renderTableWithLookupAndGetCell(undefined);
    await waitFor(() => {
      const cell = screen.getByRole("gridcell");
      expect(cell).toBeDefined();
      expect(cell.textContent).toBe("");
    });
  });

  it("uses custom cell renderer, if provided", async () => {
    renderTableWithLookupAndGetCell(undefined, true);
    await waitFor(() => {
      const cell = screen.getByRole("gridcell");
      expect(cell).toBeDefined();
      expect(cell.textContent).toBe("CUSTOM");
    });
  });
});
