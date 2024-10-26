import { generateUUID } from "./uuid";

export const createFileFromImageURL = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Error fetching image: ${response.status}`);
    }
    const fileType = image.type.split("/").at(-1);
    const fileName = `${generateUUID()}.${fileType}`;

    const blob = await response.blob();
    const file = new File([blob], fileName, {
      type: response.headers.get("content-type"),
    });

    return file;
  } catch (error) {
    console.error(error);
    return null;
  }
};
