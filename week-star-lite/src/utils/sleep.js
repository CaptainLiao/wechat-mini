export default async function sleep(t) {
  await new Promise(resolve => setTimeout(resolve, t * 1000));
}