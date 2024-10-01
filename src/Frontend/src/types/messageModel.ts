export interface MessageModel {
  id: number;
  message: string;
  created: Date;
  received: Date;
}

export type MessageModels = MessageModel[];
