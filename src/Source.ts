import { ISource, IRecycler } from './interfaces/Recycler';

export default abstract class Source<T> implements ISource<T> {
  public abstract key: string;

  public abstract getHeight(index: number, recycler: IRecycler<T>): number;

  public abstract getWidth(index: number, recycler: IRecycler<T>): string;

  public abstract getData(index: number, recycler: IRecycler<T>): T;

  public abstract getLength(recycler: IRecycler<T>): number;

  public abstract getScrollTop(index: number, recycler: IRecycler<T>): number;

  public abstract getMaxScrollHeight(recycler: IRecycler<T>): number;
}
