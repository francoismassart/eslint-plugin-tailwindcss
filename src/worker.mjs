// worker.js
import { runAsWorker } from "synckit";

function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved!! 🎉");
    }, 2000);
  });
}

runAsWorker(async (...arguments_) => {
  // do expensive work
  const text = await resolveAfter2Seconds();
  return `result with ${arguments_.length} args ${text}`;
});
