export default async function sleep(t: number) {
  await new Promise(resolve => setTimeout(resolve, t * 1000));
}
