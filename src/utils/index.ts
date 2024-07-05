/**
 * 基于块大小和块重叠拆分长文本
 */
const splitTextWithOverlap = (text: string, blockSize: number, overlapSize: number) => {
  if (blockSize <= 0 || overlapSize < 0 || overlapSize >= blockSize) {
    throw new Error('Invalid blockSize or overlapSize');
  }

  let result = [];
  let start = 0;

  while (start + blockSize <= text.length) {
    result.push(text.substring(start, start + blockSize));
    start += blockSize - overlapSize;
  }

  if (start < text.length) {
    result.push(text.substring(start));
  }

  return result;
}

export {
  splitTextWithOverlap
}