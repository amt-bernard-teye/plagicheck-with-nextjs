export abstract class BaseRepository<Type, Props, TypeId> {
  protected abstract selectedProps(): Props;

  abstract create(entity: Type): Promise<Type>;
  abstract update(entity: Type): Promise<Type>;
  abstract delete(entity: Type): Promise<void>;
  abstract find(id: TypeId): Promise<Type | null>;
}