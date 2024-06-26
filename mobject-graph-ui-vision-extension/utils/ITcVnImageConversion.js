/* Example of data
---------------------------
{
    imageInfo: {
        nImageSize: 75,
        nWidth: 5,
        nHeight: 5,
        nXPadding: 0,
        nYPadding: 0,
        stPixelFormat: {
            bSupported: true,
            bSigned: false,
            bPlanar: false,
            bFloat: false,
            nChannels: 3,
            ePixelEncoding: "TCVN_PE_NONE",
            ePixelPackMode: "TCVN_PPM_NONE",
            nElementSize: 8,
            nTotalSize: 24,
        },
    },
    imageData:
        "7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk7Rwk",
};
*/

export function loadITcVnImageToImg(img, itcvnimage) {
  // Destructure the data object
  const {
    imageInfo: { nWidth, nHeight, stPixelFormat },
    imageData,
  } = itcvnimage;

  // Convert base64 to binary data
  const binaryData = decodeBase64ToBinary(imageData);

  // Determine the correct bytes per pixel and channels
  const { nChannels } = stPixelFormat;

  // Process the binary data based on channel information
  const processedBytes = processImageData(
    binaryData,
    nWidth,
    nHeight,
    nChannels
  );

  // Create and draw the image on the canvas
  drawImageOnCanvas(img, processedBytes, nWidth, nHeight);
}

function decodeBase64ToBinary(base64String) {
  const binaryString = window.atob(base64String);
  return new Uint8Array(
    binaryString.split("").map((char) => char.charCodeAt(0))
  );
}

function processImageData(binaryData, width, height, channels) {
  const bytes = new Uint8Array(width * height * 4);
  let j = 0;

  if (channels === 3) {
    for (let i = 0; i < binaryData.length; i += 3) {
      bytes.set([binaryData[i], binaryData[i + 1], binaryData[i + 2], 255], j);
      j += 4;
    }
  } else if (channels === 4) {
    for (let i = 0; i < binaryData.length; i += 4) {
      bytes.set(
        [
          binaryData[i],
          binaryData[i + 1],
          binaryData[i + 2],
          binaryData[i + 3],
        ],
        j
      );
      j += 4;
    }
  }

  return bytes;
}

function drawImageOnCanvas(imgElement, imageDataBytes, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const imageData = new ImageData(
    new Uint8ClampedArray(imageDataBytes),
    width,
    height
  );
  ctx.putImageData(imageData, 0, 0);

  imgElement.src = canvas.toDataURL("image/png");
}
