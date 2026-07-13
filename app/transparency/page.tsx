import { AppBar, Card, Chip, T } from "@/components/ui/kit";

export const metadata = {
  title: "Transparency · Ulurin",
  description:
    "How Ulurin shows donor breakdowns, organizer allowance, and future public receipts.",
};

export default function TransparencyPage() {
  return (
    <div style={{ minHeight: "100%", background: T.canvas, color: T.ink }}>
      <AppBar
        large
        title="Transparency"
        sub="Donation split first, public proof next."
      />
      <div style={{ padding: "12px 16px 28px", display: "grid", gap: 12 }}>
        <Card>
          <Chip kind="action">Ulurin model</Chip>
          <h1 style={{ margin: "14px 0 8px", fontSize: 24, lineHeight: 1.12 }}>
            Every donor sees where the donation goes.
          </h1>
          <p style={{ margin: 0, color: T.slate, fontSize: 14, lineHeight: 1.6 }}>
            Campaign organizers can set a transparent operational allowance from
            0% to 10%. The donor-facing breakdown shows the beneficiary amount
            and organizer allowance before anyone pledges.
          </p>
        </Card>
        <Card>
          <h2 style={{ margin: 0, fontSize: 16 }}>Current preview</h2>
          <p style={{ margin: "8px 0 0", color: T.slate, fontSize: 14, lineHeight: 1.6 }}>
            Marketplace, campaign creation, split calculation, donor breakdown,
            waitlist pledge, and organizer dashboard are available as preview
            UI. No real funds move in this repo yet.
          </p>
        </Card>
        <Card>
          <h2 style={{ margin: 0, fontSize: 16 }}>Production direction</h2>
          <p style={{ margin: "8px 0 0", color: T.slate, fontSize: 14, lineHeight: 1.6 }}>
            The next production layer should persist campaigns, collect real
            donations through a compliant payment rail, and publish receipts so
            donors can audit contribution, disbursement, proof, and allowance
            release.
          </p>
        </Card>
      </div>
    </div>
  );
}
