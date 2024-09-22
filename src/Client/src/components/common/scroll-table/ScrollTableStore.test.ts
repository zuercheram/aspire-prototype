import { ScrollTableStore } from "./ScrollTableStore";

describe("ScrollTableStore", () => {
  it("correctly computes total width", () => {
    const store = new ScrollTableStore();
    expect(store.totalWidth).toBe(0);

    const additionalWidthPerColumn = 2;

    const columnId1 = "columnId1";
    store.registerColumnWidth(columnId1, 100);
    expect(store.totalWidth).toBe(100 + additionalWidthPerColumn);

    const columnId2 = "columnId2";
    store.registerColumnWidth(columnId2, 200);
    expect(store.totalWidth).toBe(300 + additionalWidthPerColumn * 2);
  });
});
