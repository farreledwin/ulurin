// Sharing a campaign is the product's growth loop — in Indonesia that means
// WhatsApp. Web Share API where it exists (Android WebView, mobile browsers),
// wa.me as the fallback everywhere else. No dependency: the platform does this.
export async function shareCampaign(campaign) {
  const url = `${window.location.origin}/campaign/${campaign.slug}`;
  const text = `${campaign.title} — ${campaign.excerpt}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: campaign.title, text, url });
      return "shared";
    } catch (error) {
      // The user closing the share sheet is a choice, not an error to fall
      // through on — falling through would immediately open WhatsApp at them.
      if (error.name === "AbortError") return "cancelled";
    }
  }

  window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, "_blank", "noopener");
  return "whatsapp";
}
