import { S3 } from "aws-sdk";
import * as csvParser from "csv-parser";

class ImportService {
  static readonly BUCKET_NAME = "import-products-csv-rs-school";
  private static readonly CATALOG_PATH = "uploaded/";

  #s3: S3 = new S3({ region: "eu-west-1" });

  getSignedUrl(name: string): Promise<string> {
    const params = {
      Bucket: ImportService.BUCKET_NAME,
      Key: ImportService.CATALOG_PATH + name,
      Expires: 60,
      ContentType: "text/csv",
    };

    return this.#s3.getSignedUrlPromise("putObject", params);
  }

  async processImportedFile(name: string): Promise<void> {
    await this.parseCSV(name);
    await this.moveToParsed(name);
  }

  private parseCSV(name: string): Promise<void> {
    const results = [];

    console.log("Start parsing CSV");

    return new Promise<void>((res, rej) => {
      this.#s3
        .getObject({
          Bucket: ImportService.BUCKET_NAME,
          Key: name,
        })
        .createReadStream()
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          console.log("Parse finished!");
          console.log(results);
          res();
        })
        .on("error", (error) => {
          console.error("CSV parse error");
          rej(error);
        });
    });
  }

  private async moveToParsed(name: string): Promise<void> {
    console.log("Moving file ", name);

    await this.#s3
      .copyObject({
        Bucket: ImportService.BUCKET_NAME,
        CopySource: ImportService.BUCKET_NAME + "/" + name,
        Key: name.replace("uploaded", "parsed"),
      })
      .promise();

    console.log("File copied to ", name.replace("uploaded", "parsed"));

    await this.#s3
      .deleteObject({
        Bucket: ImportService.BUCKET_NAME,
        Key: name,
      })
      .promise();

    console.log("Old file deleted ", name);
  }
}

export default new ImportService();
