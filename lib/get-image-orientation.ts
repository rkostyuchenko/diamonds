export default (file: Blob, callback: (orientation: number) => void): void => {
  const reader = new FileReader();

  reader.onload = (e: ProgressEvent<FileReader>): void => {
    if (e.target === null) return callback(-1);

    const view = new DataView(e.target.result as ArrayBuffer);

    if (view.getUint16(0, false) !== 0xFFD8) {
      return callback(-2);
    }

    const length = view.byteLength;
    let offset = 2;

    while (offset < length) {
      if (view.getUint16(offset + 2, false) <= 8) return callback(-1);

      const marker = view.getUint16(offset, false);
      offset += 2;

      if (marker === 0xFFE1) {
        const checkExifAsciiString = view.getUint32(offset += 2, false) !== 0x45786966;

        if (checkExifAsciiString) {
          return callback(-1);
        }

        const little = view.getUint16(offset += 6, false) === 0x4949;
        offset += view.getUint32(offset + 4, little);
        const tags = view.getUint16(offset, little);
        offset += 2;

        for (let i = 0; i < tags; i++) {
          if (view.getUint16(offset + (i * 12), little) === 0x0112) {
            return callback(view.getUint16(offset + (i * 12) + 8, little));
          }
        }
      } else if ((marker & 0xFF00) !== 0xFF00) { // eslint-disable-line no-bitwise
        break;
      } else {
        offset += view.getUint16(offset, false);
      }
    }

    return callback(-1);
  };

  reader.readAsArrayBuffer(file);
};
