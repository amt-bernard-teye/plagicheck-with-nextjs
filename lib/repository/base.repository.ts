export abstract class BaseRepository<Type, Props, TypeId> {
  protected rows = 9;
  protected abstract selectedProps(): Props;

  abstract create(entity: Type): Promise<Type>;
  abstract update(entity: Type): Promise<Type>;
  abstract delete(id: TypeId): Promise<void>;
  abstract find(id: TypeId): Promise<Type | null>;
}