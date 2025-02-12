import { Label } from "~/app/_components/ui/label";

export default function PatientConsent({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="has-[[data-state=checked]]:border-ring relative flex w-full items-start gap-2 rounded-lg p-4 shadow-sm shadow-black/5">
      <input
        type="checkbox"
        id="consent"
        className="order-1 bg-gray-900 text-white accent-white after:absolute after:inset-0"
        aria-describedby="consent-description"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="flex grow items-center gap-3">
        <div className="text-2xl">🎙️</div>
        <div className="grid gap-2">
          <Label className="text-white" htmlFor="consent">
            I have consent to record this consultation
          </Label>
          <p id="consent-description" className="text-muted-foreground text-xs">
            All consultations are recorded and stored securely. Absolutely no
            data is shared with any third parties.
          </p>
        </div>
      </div>
    </div>
  );
}
