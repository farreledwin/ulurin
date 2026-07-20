import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import { campaigns, completedCampaigns } from "./data/campaigns.js";
import { swMock } from "./test/pwa-register-stub.js";

function renderApp(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppProvider>
        <App />
      </AppProvider>
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Ulurin core experience", () => {
  it("explains the product promise on the landing page", () => {
    renderApp();

    expect(
      screen.getByRole("heading", { name: /berbuat baik sebagai pekerjaan utama/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /simulasi lokal/i })).toBeInTheDocument();
    // hero-story-card (berikut avatar dekoratif dan angka "1.234" hardcoded-nya)
    // diganti kipas kartu campaign. Assertion baru menguji hal yang lebih berarti:
    // setiap campaign nyata punya link hidup dari halaman utama.
    const fan = screen.getByRole("list", { name: /campaign yang sedang berjalan/i });
    expect(within(fan).getAllByRole("link")).toHaveLength(campaigns.length);
    expect(
      within(fan).getByRole("link", { name: new RegExp(campaigns[1].shortTitle, "i") }),
    ).toHaveAttribute("href", `/campaign/${campaigns[1].slug}`);
  });

  it("lets mobile readers move through compact problem facts", async () => {
    const user = userEvent.setup();
    renderApp();

    expect(screen.getByRole("region", { name: /fakta masalah kepercayaan donasi/i })).toBeInTheDocument();
    expect(screen.getByText(/1 dari 2/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /fakta berikutnya/i }));
    expect(screen.getByText(/2 dari 2/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /fakta berikutnya/i })).toBeDisabled();
  });

  it("lets a donor choose a donation amount", async () => {
    const user = userEvent.setup();
    renderApp("/donate/bersihkan-ciliwung");

    await user.click(screen.getByRole("button", { name: /Rp\s*100\.000/ }));

    expect(
      screen.getByRole("button", { name: /kirim kebaikan.*rp\s*100\.000/i }),
    ).toBeEnabled();
    expect(screen.getAllByText(/Rp\s*100\.000/).length).toBeGreaterThan(0);
  });

  it("shows a different suggested donation for each story", async () => {
    const user = userEvent.setup();
    renderApp("/cerita");

    expect(screen.getByText(/^Rp\s*50\.000$/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /cerita berikutnya/i }));

    expect(screen.getByText(/^Rp\s*25\.000$/)).toBeInTheDocument();
  });

  it("explains ledger in plain language and shows the full sample donation", async () => {
    const user = userEvent.setup();
    renderApp("/transparansi");

    expect(screen.getByText(/^Rp\s*100\.000$/)).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: /penjelasan ledger/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /apa itu ledger/i }));

    expect(screen.getByRole("region", { name: /penjelasan ledger/i })).toBeInTheDocument();
    expect(screen.getByText(/ledger adalah buku kas digital/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tutup penjelasan/i })).toHaveAttribute("aria-expanded", "true");
  });

  it("creates a local receipt without asking for payment credentials", async () => {
    const user = userEvent.setup();
    renderApp("/donate/bersihkan-ciliwung");

    await user.click(screen.getByRole("button", { name: /kirim kebaikan.*rp\s*50\.000/i }));

    expect(
      await screen.findByRole("heading", { name: /^terima kasih\.?$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /donasi selesai\. penyaluran dan buktinya belum/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /1 bintang/i })).not.toBeInTheDocument();
  });

  it("only opens creator rating from a completed campaign", async () => {
    const user = userEvent.setup();
    renderApp("/completed/bersih-sungai-cikapundung");

    expect(screen.queryByRole("button", { name: /5 bintang/i })).not.toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: /beri rating setelah melihat bukti/i }));

    expect(
      screen.getByRole("heading", { name: /bukti sudah tersedia\. sekarang nilai hendra kurniawan/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/dokumentasi penyaluran/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/invoice dan konfirmasi/i).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: /5 bintang/i }));
    await user.click(screen.getByRole("button", { name: /kirim rating untuk hendra kurniawan/i }));

    expect(screen.getByRole("status")).toHaveTextContent(/rating anda sudah tersimpan/i);
    await user.click(screen.getByRole("link", { name: /kembali ke dokumentasi campaign/i }));
    expect(screen.getByText(/tersimpan di sesi prototype/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /edit rating anda/i })).toBeInTheDocument();
  });

  it("uses a distinct face portrait and donor comments for every active campaign", () => {
    campaigns.forEach((campaign) => {
      expect(campaign.organizer.avatar).toMatch(/^\/assets\/creators\/.+\.webp$/);
      expect(campaign.organizer.avatar).not.toBe(campaign.image);
      expect(campaign.comments.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("opens a completed campaign with distribution proof and donor reviews", async () => {
    const user = userEvent.setup();
    renderApp("/creator/hendra-kurniawan");

    const historyLink = screen.getByRole("link", { name: /bersih sungai cikapundung/i });
    expect(historyLink).toHaveAttribute("href", "/completed/bersih-sungai-cikapundung");
    await user.click(historyLink);

    expect(screen.getByRole("heading", { name: /dokumentasi yang mengikat cerita dengan hasil/i })).toBeInTheDocument();
    expect(screen.queryByText(/konfirmasi penerima tersedia/i)).not.toBeInTheDocument();
    expect(screen.getByText(/kelompok kerja sungai ciliwung mengonfirmasi bantuan telah diterima/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /yang dinilai setelah hasilnya terlihat/i })).toBeInTheDocument();
  });

  it("lets a donor add a session-only campaign comment", async () => {
    const user = userEvent.setup();
    renderApp("/campaign/bersihkan-ciliwung");

    await user.type(
      screen.getByPlaceholderText(/tulis pesan untuk hendra kurniawan/i),
      "Mohon lanjutkan update berat sampah setelah aksi.",
    );
    await user.click(screen.getByRole("button", { name: /kirim komentar/i }));

    expect(screen.getByText("Mohon lanjutkan update berat sampah setelah aksi.")).toBeInTheDocument();
    expect(screen.getByText(/4 komentar terverifikasi/i)).toBeInTheDocument();
  });

  it("provides evidence and reviews for every completed campaign", () => {
    expect(completedCampaigns.length).toBeGreaterThanOrEqual(campaigns.length * 2);
    const completedImages = completedCampaigns.map((campaign) => campaign.image);
    expect(new Set(completedImages).size).toBe(completedImages.length);
    completedCampaigns.forEach((campaign) => {
      expect(campaign.proof.length).toBeGreaterThanOrEqual(2);
      expect(campaign.reviews.length).toBeGreaterThanOrEqual(2);
      expect(campaign.image).toMatch(/^\/assets\/completed\/.+\.webp$/);
      expect(campaigns.some((activeCampaign) => activeCampaign.image === campaign.image)).toBe(false);
      expect(campaign.organizer.avatar).not.toBe(campaign.image);
      expect(campaign.proof.filter((item) => item.image)).toHaveLength(1);
      expect(campaign.proof.some((item) => item.reference)).toBe(true);
    });

    campaigns.forEach((campaign) => {
      const history = completedCampaigns.filter(
        (completedCampaign) => completedCampaign.organizerSlug === campaign.organizer.slug,
      );
      expect(history.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("links every completed campaign to its own rating flow", () => {
    completedCampaigns.forEach((campaign) => {
      const view = renderApp(`/completed/${campaign.slug}`);
      expect(screen.getByRole("link", { name: /beri rating setelah melihat bukti/i })).toHaveAttribute(
        "href",
        `/review/completed/${campaign.slug}`,
      );
      view.unmount();
    });
  });

  it("keeps rating unavailable on an active campaign", () => {
    renderApp("/campaign/bersihkan-ciliwung");

    expect(screen.queryByRole("link", { name: /beri rating setelah melihat bukti/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /5 bintang/i })).not.toBeInTheDocument();
  });

  // Reload otomatis bisa membunuh transaksi testnet yang sedang jalan: semua
  // state di app ini cuma useState. Jadi versi baru menawarkan diri, dan
  // tawarannya harus bertahan sampai user memilih — bukan hilang dalam 3,2 detik.
  it("offers a reload for a new version and never forces it", async () => {
    swMock.updateServiceWorker = vi.fn();
    vi.useFakeTimers();
    renderApp();

    act(() => swMock.needRefresh());
    const button = screen.getByRole("button", { name: /muat ulang/i });

    act(() => vi.advanceTimersByTime(60_000));
    expect(button).toBeInTheDocument();
    expect(swMock.updateServiceWorker).not.toHaveBeenCalled();

    fireEvent.click(button);
    expect(swMock.updateServiceWorker).toHaveBeenCalledTimes(1);
  });

  it("still auto-dismisses a plain text toast", () => {
    vi.useFakeTimers();
    renderApp("/campaign/bersihkan-ciliwung");

    fireEvent.change(screen.getByLabelText(/tulis dukungan atau pertanyaan/i), {
      target: { value: "Semangat terus." },
    });
    fireEvent.click(screen.getByRole("button", { name: /kirim komentar/i }));
    expect(screen.getByText(/komentar simulasi anda/i)).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(4000));
    expect(screen.queryByText(/komentar simulasi anda/i)).not.toBeInTheDocument();
  });
});
