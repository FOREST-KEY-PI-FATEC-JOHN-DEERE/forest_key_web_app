import { t } from "i18next";

export function generateStrongSecret() {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()-_=+[]{}<>?";
  const allChars = upper + lower + numbers + symbols;

  let newSecret = "";
  for (let i = 0; i < 16; i++) {
    newSecret += allChars[Math.floor(Math.random() * allChars.length)];
  }
  return newSecret;
}

export function getExpirationDate(createdAt: string) {
  const base = new Date(createdAt);
  base.setDate(base.getDate() + 45);
  return base;
}

export function renderExpirationBadge(expiresAtDate: Date) {
  const now = new Date();
  const diffMs = expiresAtDate.getTime() - now.getTime();
  const daysToExpire = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (daysToExpire > 10) return null;

  const safeDays = daysToExpire <= 0 ? 1 : daysToExpire;
  let badgeClass =
    "inline-flex items-center rounded-full border px-2 py-[2px] text-[10px] font-semibold ";
  const label = `${t("expires_in") ?? "Expires in"} ${safeDays} ${
    t("days") ?? "days"
  }`;

  if (safeDays <= 3) {
    badgeClass +=
      "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-300";
  } else if (safeDays <= 6) {
    badgeClass +=
      "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400 border-orange-300";
  } else {
    badgeClass +=
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-300";
  }

  return <span className={badgeClass}>{label}</span>;
}
