import { SQS } from "aws-sdk";

class QueueService {
  #queueURL: string = process.env.SQS_URL;
  #sqs: SQS = new SQS({ region: "eu-west-1" });

  async addToQueue(data: NotificationMessage): Promise<void> {
    const payload: string = JSON.stringify(data);

    await this.#sqs
      .sendMessage({
        QueueUrl: this.#queueURL,
        MessageBody: payload,
      })
      .promise();
  }
}

export interface NotificationMessage {
  success: boolean;
  message: string;
}

export type { QueueService };
export default new QueueService();
