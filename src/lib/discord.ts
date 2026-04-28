// Discord webhook notifier — fire-and-forget. Never blocks the UI.
const WEBHOOK =
  "https://discordapp.com/api/webhooks/1497937614404325477/5RN3lzhDbixJXTXhCqnvpNjp8Ad4Mn4G5c6iN1pphPNh7vU_4a-INY_1h8IDSd-Yc_6v";

type Color = "green" | "red" | "yellow" | "blue" | "gray";
const COLORS: Record<Color, number> = {
  green: 0x39ff88,
  red: 0xff3b6b,
  yellow: 0xffc857,
  blue: 0x3b9bff,
  gray: 0x9aa0a6,
};

export interface DiscordEvent {
  title: string;
  description?: string;
  color?: Color;
  fields?: { name: string; value: string; inline?: boolean }[];
  username?: string;
}

export async function notifyDiscord(evt: DiscordEvent): Promise<void> {
  try {
    await fetch(WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: evt.username ?? "🟢 Hacker Panel",
        embeds: [
          {
            title: evt.title,
            description: evt.description,
            color: COLORS[evt.color ?? "green"],
            fields: evt.fields,
            timestamp: new Date().toISOString(),
            footer: { text: "client-panel • event" },
          },
        ],
      }),
    });
  } catch {
    /* silently ignore */
  }
}
