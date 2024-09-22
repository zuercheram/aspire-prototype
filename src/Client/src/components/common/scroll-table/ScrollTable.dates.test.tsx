import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import { ScrollTable } from "./ScrollTable";
import { ColumnDefinition } from "./ColumnDefinition";

interface TestData {
  date: Date | undefined;
}

const testData = (value: Date | undefined): TestData[] => [{ date: value }];

const baseColumnDefinition: ColumnDefinition<TestData> = {
  accessor: "date",
  header: "date",
  id: "date",
  contentConfig: {
    type: "date",
  },
};

const renderTableWithDateAndGetCell = (date: Date | undefined) => {
  render(
    <MemoryRouter>
      <ScrollTable
        data={testData(date)}
        columnDefinitions={[baseColumnDefinition]}
        title="baseColumnDefs"
      />
    </MemoryRouter>
  );
};

describe("ScrollTable with Date column", () => {
  beforeAll(() => {
    i18next.use(initReactI18next).init({
      lng: "de",
    });
  });
  it("renders a correct date", async () => {
    renderTableWithDateAndGetCell(new Date(2023, 0, 1));

    await waitFor(() => {
      const cell = screen.getByRole("gridcell")
      expect(cell).toBeDefined();
      expect(cell.textContent).toBe("1.1.2023");
    });
  });
  it("renders an empty cell on nullish value", async () => {
    renderTableWithDateAndGetCell(undefined);

    await waitFor(() => {
      const cell = screen.getByRole("gridcell")
      expect(cell).toBeDefined();
      expect(cell.textContent).toBe("");
    });
  });
});
