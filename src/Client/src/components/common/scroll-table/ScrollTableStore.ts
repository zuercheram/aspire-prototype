import { action, makeAutoObservable, observable } from "mobx";

export class ScrollTableStore {
  public pixelWidthsByColumnIds: Record<string, number> = {};

  public totalWidth = 0;

  constructor() {
    makeAutoObservable(this, {
      totalWidth: observable,
      registerColumnWidth: action,
    });
  }

  public registerColumnWidth = (id: string, widthPx: number) => {
    const currentWidthPx = this.pixelWidthsByColumnIds[id] ?? 0;
    const paddedWidth = widthPx + 2; // Add a small value here so there's always enough space for the content - otherwise we sometimes get ellipses too soon
    if (paddedWidth > currentWidthPx) {
      this.pixelWidthsByColumnIds[id] = paddedWidth;
      const newTotalWidth = Object.values(this.pixelWidthsByColumnIds).reduce(
        (val, columnWidth) => val + columnWidth,
        0
      );
      this.totalWidth = newTotalWidth;
    }
  };
}
