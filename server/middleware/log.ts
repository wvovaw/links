export default defineEventHandler((event) => {
  console.log(`REQ: ${getRequestURL(event)}`);
});
