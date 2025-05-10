import axios from "axios";
import * as cheerio from "cheerio";
import sharp from "sharp";
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const downloadImageAndReplaceSrc = async (htmlContent, propertyId) => {
  const $ = cheerio.load(htmlContent);
  const downloadPromises = [];

  const propertyMediaDir = path.join(
    __dirname,
    `../../../media/${propertyId}/editor`
  );
  if (!fs.existsSync(propertyMediaDir)) {
    fs.mkdirSync(propertyMediaDir, { recursive: true });
  }

  $("img").each(function () {
    const img = $(this);
    const src = img.attr("src");

    if (
      src &&
      /^https?:\/\//.test(src) &&
      !src.startsWith(`${process.env.MEDIA_URL}/${propertyId}/editor`)
    ) {
      const downloadPromise = (async () => {
        await delay(1); // Small delay to ensure unique timestamp
        const timestamp = Date.now();
        return axios({
          method: "GET",
          url: src,
          responseType: "arraybuffer",
        })
          .then(async (response) => {
            const contentType = response.headers["content-type"];
            const ext = contentType?.split("/")[1]?.split(";")[0] || "jpg";
            const originalFile = `img-editor-${timestamp}.${ext}`;
            const webpFile = `img-editor-${timestamp}-compressed.webp`;

            const originalPath = path.join(propertyMediaDir, originalFile);
            const webpPath = path.join(propertyMediaDir, webpFile);

            fs.writeFileSync(originalPath, response.data);
            await sharp(response.data).webp({ quality: 40 }).toFile(webpPath);

            img.attr(
              "src",
              `${process.env.MEDIA_URL}/${propertyId}/editor/${webpFile}`
            );
          })
          .catch((error) => {
            console.error(
              `Failed to download image from ${src}:`,
              error.message
            );
          });
      })();

      downloadPromises.push(downloadPromise);
    } else if (src && src.startsWith("data:image")) {
      const downloadPromise = (async () => {
        await delay(1);
        const timestamp = Date.now();
        try {
          const [, format, base64] =
            src.match(/data:image\/(png|jpg|jpeg|gif);base64,(.+)/) || [];
          if (!format || !base64) {
            console.error("Invalid Base64 image format:", src.slice(0, 50));
            return;
          }

          const buffer = Buffer.from(base64, "base64");
          const originalFile = `img-editor-${timestamp}.${format}`;
          const webpFile = `img-editor-${timestamp}-compressed.webp`;

          const originalPath = path.join(propertyMediaDir, originalFile);
          const webpPath = path.join(propertyMediaDir, webpFile);

          fs.writeFileSync(originalPath, buffer);
          await sharp(buffer).webp({ quality: 40 }).toFile(webpPath);

          img.attr(
            "src",
            `${process.env.MEDIA_URL}/${propertyId}/editor/${webpFile}`
          );
        } catch (error) {
          console.error("Failed to process Base64 image:", error.message);
        }
      })();

      downloadPromises.push(downloadPromise);
    }
  });

  await Promise.all(downloadPromises);
  return $.html();
};

export const downloadImageAndReplaceSrcNonProperty = async (
  htmlContent,
  folder_name
) => {
  if (!htmlContent || !folder_name) {
    console.error("Invalid input: htmlContent or folder_name is missing");
    return htmlContent;
  }

  const $ = cheerio.load(htmlContent);
  const downloadPromises = [];

  const propertyMediaDir = path.join(
    __dirname,
    `../../../media/${folder_name}/editor`
  );
  if (!fs.existsSync(propertyMediaDir)) {
    fs.mkdirSync(propertyMediaDir, { recursive: true });
  }

  $("img").each(function () {
    const img = $(this);
    const src = img.attr("src");

    if (
      src &&
      /^https?:\/\//.test(src) &&
      !src.startsWith(`${process.env.MEDIA_URL}/${folder_name}/editor`)
    ) {
      const downloadPromise = (async () => {
        await delay(1);
        const timestamp = Date.now();

        try {
          const response = await axios({
            method: "GET",
            url: src,
            responseType: "arraybuffer",
          });

          const contentType = response.headers["content-type"];
          const ext = contentType?.split("/")[1]?.split(";")[0] || "jpg";
          const originalFile = `img-editor-${timestamp}.${ext}`;
          const webpFile = `img-editor-${timestamp}-compressed.webp`;

          const originalPath = path.join(propertyMediaDir, originalFile);
          const webpPath = path.join(propertyMediaDir, webpFile);

          fs.writeFileSync(originalPath, response.data);
          await sharp(response.data).webp({ quality: 40 }).toFile(webpPath);

          img.attr(
            "src",
            `${process.env.MEDIA_URL}/${folder_name}/editor/${webpFile}`
          );
        } catch (error) {
          if (error.response?.status === 404) {
            console.warn(`Image not found (404): ${src}`);
            img.remove();
          } else {
            console.error(
              `Failed to download image from ${src}:`,
              error.message
            );
          }
        }
      })();

      downloadPromises.push(downloadPromise);
    } else if (src && src.startsWith("data:image")) {
      const downloadPromise = (async () => {
        await delay(1);
        const timestamp = Date.now();

        try {
          const [, format, base64] =
            src.match(/data:image\/(png|jpg|jpeg|gif);base64,(.+)/) || [];

          if (!format || !base64) {
            console.error("Invalid Base64 image format:", src.slice(0, 50));
            return;
          }

          const buffer = Buffer.from(base64, "base64");
          const originalFile = `img-editor-${timestamp}.${format}`;
          const webpFile = `img-editor-${timestamp}-compressed.webp`;

          const originalPath = path.join(propertyMediaDir, originalFile);
          const webpPath = path.join(propertyMediaDir, webpFile);

          fs.writeFileSync(originalPath, buffer);
          await sharp(buffer).webp({ quality: 40 }).toFile(webpPath);

          img.attr(
            "src",
            `${process.env.MEDIA_URL}/${folder_name}/editor/${webpFile}`
          );
        } catch (error) {
          console.error("Failed to process Base64 image:", error.message);
        }
      })();

      downloadPromises.push(downloadPromise);
    }
  });

  await Promise.all(downloadPromises);
  return $.html();
};
