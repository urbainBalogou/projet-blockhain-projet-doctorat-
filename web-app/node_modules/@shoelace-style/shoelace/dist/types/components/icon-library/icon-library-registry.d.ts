export declare type IconLibraryResolver = (name: string) => string;
export declare type IconLibraryMutator = (svg: SVGElement) => void;
interface IconLibraryRegistry {
  name: string;
  resolver: IconLibraryResolver;
  mutator?: IconLibraryMutator;
}
export declare function watchIcon(icon: HTMLSlIconElement): void;
export declare function unwatchIcon(icon: HTMLSlIconElement): void;
export declare function getLibrary(name?: string): IconLibraryRegistry;
export declare function registerLibrary(name: string, resolver: IconLibraryResolver, mutator?: IconLibraryMutator): void;
export declare function unregisterLibrary(name: string): void;
export {};
