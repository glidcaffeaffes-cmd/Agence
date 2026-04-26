import { createHash } from "node:crypto";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  if (
    !config.cloudinaryCloudName ||
    !config.cloudinaryApiKey ||
    !config.cloudinaryApiSecret
  ) {
    throw createError({
      statusCode: 500,
      statusMessage: "Cloudinary configuration is missing",
    });
  }

  const files = await readMultipartFormData(event);
  const image = files?.find((entry) => entry.name === "file");
  const folder =
    files?.find((entry) => entry.name === "folder")?.data?.toString("utf8") ||
    "voyagehub/profiles";

  if (!image?.data?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "No image file provided",
    });
  }

  if (image.type && !image.type.startsWith("image/")) {
    throw createError({
      statusCode: 400,
      statusMessage: "Only image files are allowed",
    });
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signaturePayload = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1")
    .update(`${signaturePayload}${config.cloudinaryApiSecret}`)
    .digest("hex");

  const body = new FormData();
  body.append(
    "file",
    new Blob([image.data], { type: image.type || "application/octet-stream" }),
    image.filename || "profile-image",
  );
  body.append("folder", folder);
  body.append("timestamp", timestamp);
  body.append("api_key", config.cloudinaryApiKey);
  body.append("signature", signature);

  const endpoint = `https://api.cloudinary.com/v1_1/${config.cloudinaryCloudName}/image/upload`;
  const response = await fetch(endpoint, {
    method: "POST",
    body,
  });
  const payload = (await response.json()) as {
    secure_url?: string;
    public_id?: string;
    error?: { message?: string };
  };

  if (!response.ok || !payload.secure_url) {
    throw createError({
      statusCode: response.status || 500,
      statusMessage: payload.error?.message || "Cloudinary upload failed",
    });
  }

  return {
    url: payload.secure_url,
    publicId: payload.public_id || "",
  };
});
