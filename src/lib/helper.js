export const censorAddress = (addr) => {
  const censored =
    addr.substring(0, 6) + ".." + addr.substring(addr.length - 6);
  return censored;
};
