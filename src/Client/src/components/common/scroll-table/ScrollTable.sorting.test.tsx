import { act, fireEvent, render, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ScrollTable } from "./ScrollTable";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

interface TestData {
  text: string;
  number: number;
}

const testData: TestData[] = [
  { text: "ba", number: 1 },
  { text: "abc", number: 2 },
];

const renderTable = () =>
  render(
    <MemoryRouter>
      <ScrollTable
        data={testData}
        columnDefinitions={[
          {
            accessor: "text",
            header: "text",
            id: "text",
          },
          {
            accessor: "number",
            header: "number",
            id: "number",
            contentConfig: {
              type: "number",
            },
          },
        ]}
        title="baseColumnDefs"
      />
    </MemoryRouter>
  );

const expectNumber1BeforeNumber2 = (cells: HTMLElement[]) => {
  const number1Index = cells.findIndex((cell) => cell.textContent === "1");
  const number2Index = cells.findIndex((cell) => cell.textContent === "2");

  expect(number1Index).toBeLessThan(number2Index);
};

const expectNumber2BeforeNumber1 = (cells: HTMLElement[]) => {
  const number1Index = cells.findIndex((cell) => cell.textContent === "1");
  const number2Index = cells.findIndex((cell) => cell.textContent === "2");

  expect(number2Index).toBeLessThan(number1Index);
};

describe("ScrollTable sorting", () => {
  beforeAll(() => {
    i18next.use(initReactI18next).init({
      lng: "de",
    });
  });
  it("cycles through sort orders on header clicks", async () => {
    const table = renderTable();
    let cells = await within(table.baseElement).findAllByRole("gridcell");
    expectNumber1BeforeNumber2(cells);
    const textHeader = await within(table.baseElement).findByText("text");
    expect(textHeader).toBeDefined();
    // change sorting
    act(() => fireEvent.click(textHeader));
    cells = await within(table.baseElement).findAllByRole("gridcell");
    expectNumber2BeforeNumber1(cells);
    // change sorting again
    act(() => fireEvent.click(textHeader));
    cells = await within(table.baseElement).findAllByRole("gridcell");
    expectNumber1BeforeNumber2(cells);
  });
});
