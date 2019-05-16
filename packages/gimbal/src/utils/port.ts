import getPort from 'get-port';

const findPort = async (): Promise<number> => {
  const port = await getPort({
    port: getPort.makeRange(3000, 3100),
  });

  return port;
};

export default findPort;
