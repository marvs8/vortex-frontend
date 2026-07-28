import { t } from "@/i18n/messages";

export function Example() {
  return (
    <div>
      <button>{t("wallet.connect")}</button>
      <span>ETH</span> {/* i18n-ignore */}
    </div>
  );
}
