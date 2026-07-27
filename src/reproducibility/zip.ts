const encoder = new TextEncoder();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1)
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function createStoredZipBytes(
  files: Record<string, string>,
): Uint8Array {
  const entries = Object.entries(files).map(([name, content]) => ({
    name: encoder.encode(name),
    data: encoder.encode(content),
  }));
  const localSize = entries.reduce(
    (sum, entry) => sum + 30 + entry.name.length + entry.data.length,
    0,
  );
  const centralSize = entries.reduce(
    (sum, entry) => sum + 46 + entry.name.length,
    0,
  );
  const buffer = new ArrayBuffer(localSize + centralSize + 22);
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  let local = 0;
  let central = localSize;
  for (const entry of entries) {
    const checksum = crc32(entry.data);
    view.setUint32(local, 0x04034b50, true);
    view.setUint16(local + 4, 20, true);
    view.setUint32(local + 14, checksum, true);
    view.setUint32(local + 18, entry.data.length, true);
    view.setUint32(local + 22, entry.data.length, true);
    view.setUint16(local + 26, entry.name.length, true);
    bytes.set(entry.name, local + 30);
    bytes.set(entry.data, local + 30 + entry.name.length);
    view.setUint32(central, 0x02014b50, true);
    view.setUint16(central + 4, 20, true);
    view.setUint16(central + 6, 20, true);
    view.setUint32(central + 16, checksum, true);
    view.setUint32(central + 20, entry.data.length, true);
    view.setUint32(central + 24, entry.data.length, true);
    view.setUint16(central + 28, entry.name.length, true);
    view.setUint32(central + 42, local, true);
    bytes.set(entry.name, central + 46);
    local += 30 + entry.name.length + entry.data.length;
    central += 46 + entry.name.length;
  }
  view.setUint32(central, 0x06054b50, true);
  view.setUint16(central + 8, entries.length, true);
  view.setUint16(central + 10, entries.length, true);
  view.setUint32(central + 12, centralSize, true);
  view.setUint32(central + 16, localSize, true);
  return bytes;
}

export function createStoredZip(files: Record<string, string>): Blob {
  const bytes = createStoredZipBytes(files);
  return new Blob([bytes.buffer as ArrayBuffer], {
    type: "application/zip",
  });
}
