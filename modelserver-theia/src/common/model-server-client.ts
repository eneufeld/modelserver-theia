/********************************************************************************
 * Copyright (c) 2019 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { JsonRpcServer } from "@theia/core/lib/common/messaging";


export const MODEL_SERVER_CLIENT_SERVICE_PATH = '/services/modelserverclient';

export interface ModelServerCommandObjectValue {
  eClass: string;
  $ref: string;
}
export interface ModelServerCommand {
  eClass: 'http://www.eclipsesource.com/schema/2019/modelserver/command#//Command';
  type: 'compound' | 'add' | 'remove' | 'set' | 'replace' | 'move';
  owner: {
    eClass: string;
    $ref: string;
  };
  feature: string;
  indices?: number[];
  dataValues?: any[];
  objectValues?: ModelServerCommandObjectValue[];
  objectsToAdd?: object[];
  commands?: ModelServerCommand[];
}

export interface ModelServerMessage {
  type: "dirtyState" | "incrementalUpdate" | "fullUpdate" | "success" | "error";
  data: any;
}
export const ModelServerFrontendClient = Symbol('ModelServerFrontendClient');
export interface ModelServerFrontendClient {
  onOpen(): void;

  onMessage(message: ModelServerMessage): void;

  onClosed(code: number, reason: string): void;

  onError(error: Error): void;
}

export const ModelServerClient = Symbol('ModelServerClient');
export interface ModelServerClient
  extends JsonRpcServer<ModelServerFrontendClient> {
  initialize(): Promise<boolean>;

  get(modelUri: string): Promise<Response<string>>;
  getAll(): Promise<Response<string[] | string>>;
  delete(modelUri: string): Promise<Response<boolean>>;
  // snapshot update
  update(modelUri: string, newModel: any): Promise<Response<string>>;

  configure(configuration?: ServerConfiguration): Promise<Response<boolean>>;
  ping(): Promise<Response<boolean>>;
  save(modelUri: string): Promise<Response<boolean>>;

  getLaunchOptions(): Promise<LaunchOptions>;
  // subscribe
  subscribe(modelUri: string): void;
  unsubscribe(modelUri: string): void;

  edit(
    modelUri: string,
    command: ModelServerCommand
  ): Promise<Response<boolean>>;
}

export const LaunchOptions = Symbol('LaunchOptions');
export interface LaunchOptions {
  baseURL: string;
  serverPort: number;
  hostname: string;
  jarPath?: string;
  additionalArgs?: string[];
}
export const DEFAULT_LAUNCH_OPTIONS: LaunchOptions = {
  baseURL: 'api/v1',
  serverPort: 8081,
  hostname: 'localhost'
};

export interface ServerConfiguration {
  workspaceRoot: string;
}
export class Response<T> {
  constructor(
    readonly body: T,
    readonly statusCode: number,
    readonly statusMessage: string
  ) { }

  public mapBody<U>(mapper: (body: T) => U): Response<U> {
    return new Response(mapper(this.body), this.statusCode, this.statusMessage);
  }
}
