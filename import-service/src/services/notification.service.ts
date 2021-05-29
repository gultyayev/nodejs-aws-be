import { SNS } from "aws-sdk";
import { NotificationMessage } from "./queue.service";

class NotificationService {
  #topicArn: string = process.env.SNS_ARN;
  #sns: SNS = new SNS({ region: "eu-west-1" });

  async notify(body: string): Promise<void> {
    const { message, success }: NotificationMessage = JSON.parse(body);

    await this.#sns
      .publish({
        Subject: "Imported file processing info",
        Message: message,
        TopicArn: this.#topicArn,
        MessageAttributes: {
          success: {
            DataType: "String",
            StringValue: `${success}`,
          },
        },
      })
      .promise();
  }
}

export default new NotificationService();
export type { NotificationService };
