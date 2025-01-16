export const enableMocking = async () => {
  const { worker } = await import("./browser");
  const { seedMockData } = await import("./db");
  await seedMockData();

  return worker.start();
};
