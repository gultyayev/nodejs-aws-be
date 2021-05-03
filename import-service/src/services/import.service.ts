import { S3 } from "aws-sdk";

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
}

export default new ImportService();
