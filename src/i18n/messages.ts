export const messages = {
  "wallet.connect": "Connect Wallet",
} as const;

export type MessageKey = keyof typeof messages;

export function t(key: MessageKey): string {
  return messages[key];
}
