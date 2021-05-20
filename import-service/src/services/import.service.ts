import { ProductDto } from "@libs/dtos/product.dto";
import { S3 } from "aws-sdk";
import { validateSync, ValidationError } from "class-validator";
import * as csvParser from "csv-parser";
import queueService from "./queue.service";

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
    const data: unknown[] = await this.parseCSV(name);
    const validationErrors: ValidationError[][] | null = this.validateProducts(
      data as ProductDto[]
    );

    if (validationErrors) {
      console.log(`Validation failed for file ${name}`, validationErrors);

      queueService.addToQueue({
        success: false,
        message: `Validation failed for file ${name}`,
      });

      return;
    }

    await this.moveToParsed(name);

    const productNames: string = (data as ProductDto[])
      .map((product) => `"${product.title}"`)
      .join(", ");

    queueService.addToQueue({
      success: false,
      message: `Successfully added products to the DB ${productNames}`,
    });
  }

  private validateProducts(data: ProductDto[]): ValidationError[][] | null {
    let hasErrors = false;
    const validationErrors = data.map((data) => {
      const dtoInstance: ProductDto = new ProductDto(data);
      const errors: ValidationError[] = validateSync(dtoInstance);

      if (errors.length) hasErrors = true;

      return errors;
    });

    return hasErrors ? validationErrors : null;
  }

  private parseCSV(name: string): Promise<unknown[]> {
    const results = [];

    console.log("Start parsing CSV");

    return new Promise<unknown[]>((res, rej) => {
      this.#s3
        .getObject({
          Bucket: ImportService.BUCKET_NAME,
          Key: name,
        })
        .createReadStream()
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", () => {
          console.log("Parse finished!", results);
          res(results);
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
