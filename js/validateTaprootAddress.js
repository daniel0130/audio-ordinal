// TODO: Add validation for recipient address
export const validateTaprootAddress = (address) => {
  const prefix = "bc1";
  return address.startsWith(prefix);
  //   const length = address.length;
  //   if (address.substring(0, prefix.length) !== prefix) {
  //     return false;
  //   }
  //   if (length !== 66) {
  //     return false;
  //   }
  //   const checksum = address.substring(length - 6);
  //   const hash = sha256(address.substring(prefix.length, length - 6));
  //   const expectedChecksum = ripemd160(hash).slice(0, 4);
  //   if (checksum !== expectedChecksum) {
  //     return false;
  //   }
  //   return true;
};
