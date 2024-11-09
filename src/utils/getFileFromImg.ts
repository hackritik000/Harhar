export const getFileFromImg = async (imgElement: HTMLImageElement) => {
  const imgURL = imgElement.src;
  const response = await fetch(imgURL);
  const blob = await response.blob();

  const file: File | null = new File([blob], "image."+blob.type.split("image/").at(1), { type: blob.type });

  return file;
};
