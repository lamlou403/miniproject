const { connect, StringCodec } = require("nats");
const sc = StringCodec();

let nc;

(async () => {
  try {
    nc = await connect({ servers: process.env.NATS_URL });
    console.log("Connected to NATS");
  } catch (err) {
    console.error("NATS connection failed:", err);
    process.exit(1);
  }
})();

async function send(url, document_id) {
  if (!nc) {
    throw new Error("NATS not connected yet");
  }
  const payload = JSON.stringify({ url, document_id });
  await nc.publish("security.scan", sc.encode(payload));
  console.log("Message published:", payload);
}

module.exports = { nc, send };
