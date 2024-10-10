export type IMultipleFinder<Type> = {
  findAll: () => Promise<Type[]>;
}