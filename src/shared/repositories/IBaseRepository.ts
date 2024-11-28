import type { BaseModel } from "@/shared/models/BaseModel"

export interface IBaseRepository<
  T extends BaseModel,
  CreateParams,
  UpdateParams
> {
  findAll(): Promise<T[]>
  findById(id: number): Promise<T | null>
  create(params: CreateParams): Promise<T>
  update(id: number, params: UpdateParams): Promise<T>
  delete(id: number): Promise<void>
}
