import html2canvas from "html2canvas";


const downloadImage = (blob: string, fileName: string) => {
  const fakeLink = window.document.createElement("a");
  fakeLink.download = fileName;
  fakeLink.href = blob;
  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);
  fakeLink.remove();
};

export const exportAsImage = async (element: HTMLElement, imageFileName: string, scale: number = 1) => {
  const canvas = await html2canvas(element, {scale});
  const image = canvas.toDataURL("image/jpeg", 1.0);
  downloadImage(image, imageFileName);
};
