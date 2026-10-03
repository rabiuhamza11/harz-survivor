# HPR cloud node — container image (Cloud Run free tier, Koyeb free instance, Render free service).
# Persistent class if a volume is mounted at /data (Cloud Run only on paid tiers — ephemeral by default, disclosed).
FROM node:22-slim
WORKDIR /app
COPY . /app
ENV HPR_PORT=8940 HPR_OVERLAY=/data/overlay.json
EXPOSE 8940
CMD ["node", "node-cloud/server.mjs"]
