export declare const requestIcon: (url: string) => Promise<{
  ok: true;
  status: number;
  svg: string;
} | {
  ok: boolean;
  status: number;
  svg: any;
}>;
