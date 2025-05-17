import type { IScope } from "../domain/scope";

export interface IScopeProvider {
  getScopesMap(): Record<string, IScope>
}
