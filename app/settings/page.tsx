import { chatGPTSignOutPath } from "@/app/chatgpt-auth";
import { SettingsView } from "@/components/settings-view";

export default function SettingsPage() {
  return <SettingsView signOutPath={chatGPTSignOutPath("/")} />;
}
