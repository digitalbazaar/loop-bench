exports.getTimer = () => {
  const NS_PER_SEC = 1000000000;
  const NS_PER_MS = 1000000;
  const time = process.hrtime();

  return {
    elapsed() {
      const [seconds, nanoseconds] = process.hrtime(time);
      return (seconds * NS_PER_SEC + nanoseconds) / NS_PER_MS;
    }
  };
};
