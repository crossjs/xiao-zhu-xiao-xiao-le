declare module "wx-server-sdk" {
  interface WXContext {
    OPENID: string;
    APPID: string;
    UNIONID?: string;
  }

  interface Command {
    eq(value: any): any;
    neq(value: any): any;
    lt(value: number): any;
    lte(value: number): any;
    gt(value: number): any;
    gte(value: number): any;
    in(value: any[]): any;
    nin(value: any[]): any;
    and(...commands: any[]): any;
    or(...commands: any[]): any;
  }

  interface CloudInitOptions {
    env?: string | {
      database?: string;
      storage?: string;
      functions?: string;
    };
  }

  interface DatabaseInitOptions {
    env?: string;
  }

  interface AddOptions {}
  interface SetOptions {}
  interface UpdateOptions {}
  interface RemoveOptions {}
  interface WhereOptions { [key: string]: any }

  namespace Collection {}
  interface Collection {
    doc(id: string | number): Document;
    get(): Promise<any>;
    add(options: AddOptions): Promise<any>;
    set(options: SetOptions): Promise<any>;
    update(options: UpdateOptions): Promise<any>;
    remove(options?: RemoveOptions): Promise<any>;
    count(): Promise<any>;
    where(rule: WhereOptions): Collection;
    orderBy(fieldName: string, order: string): Collection;
    limit(max: number): Collection;
    skip(offset: number): Collection;
    field(definition: object): Collection;
  }

  namespace Database {}
  interface Database {
    command: Command;
    serverDate(offset?: number): any;
    collection(name: string): Collection;
  }

  namespace Document {}
  interface DocumentWhereParam { [key: string]: string }

  interface Document {
    get(): Promise<any>;
    set(options: SetOptions): Promise<any>;
    update(options: UpdateOptions): Promise<any>;
    remove(options?: RemoveOptions): Promise<any>;
    field(definition: object): Document;
  }

  function init(options?: CloudInitOptions): void;
  function database(options?: DatabaseInitOptions): Database;
  function getWXContext(): WXContext;
  function callFunction(options: {
    name: string;
    data?: any;
  }): Promise<{ result: any }>;
}
