import Link from "next/link";

import LogoText from "~/ui/logo-text";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="/">
          <LogoText />
        </Link>
      </header>
      <main className="flex-1 px-2 lg:px-0">
        <section className="w-full py-12">
          <div className="mb-4 text-center text-3xl font-bold">
            Privacy Policy
          </div>
          <div className="mx-auto max-w-[600px] text-center text-gray-500">
            Your privacy is important to us. This privacy policy document
            outlines the types of personal information that is received and
            collected by Vettee and how it is used.
          </div>
          <div className="mt-8 text-center text-sm text-gray-400">
            Last updated: 7th October 2024
          </div>
        </section>
        <article className="prose lg:prose-xl mx-auto max-w-3xl pb-24">
          <p>
            Vettee (“we”, “us”, or “our”) is committed to protecting and
            respecting your privacy. This Privacy Policy outlines how we
            collect, use, disclose, and safeguard your information when you use
            the Vettee mobile application (“App”). Please read this Privacy
            Policy carefully. If you do not agree with the terms of this Privacy
            Policy, please do not use the App.
          </p>
          <h2 className="mt-4">1. Information We Collect</h2>
          <h3>a. Personal Information</h3>
          <p>
            We may collect personal information that you voluntarily provide to
            us when you register or use the App, including but not limited to:
          </p>
          <ul>
            <li>Name</li>
            <li>Email Address</li>
            <li>Phone Number</li>
            <li>User Account Information (e.g., username, profile photo)</li>
            <li>Pet Information (e.g., pet name, breed, age)</li>
          </ul>
          <h3>b. Usage Data</h3>
          <p>
            When you access or use the App, we may automatically collect certain
            data, including but not limited to:
          </p>
          <ul>
            <li>
              Device Information (e.g., IP address, operating system, browser
              type)
            </li>
            <li>
              Usage Information (e.g., pages visited, time spent on each page)
            </li>
            <li>Geolocation Data (only if you have given permission)</li>
          </ul>
          <h3>c. Cookies and Tracking Technologies</h3>
          <p>
            We may use cookies, beacons, and similar tracking technologies to
            collect and store information. You can control your cookie settings
            through your device or browser settings.
          </p>
          <h2 className="mt-4">2. How We Use Your Information</h2>
          <p>We use the information we collect in the following ways:</p>
          <ul>
            <li>To provide, maintain, and improve the App’s functionality.</li>
            <li>To process your registration and manage your account.</li>
            <li>
              To send administrative information, such as updates and security
              alerts.
            </li>
            <li>
              To provide personalized user experiences and recommendations.
            </li>
            <li>
              To respond to your comments, questions, or customer support
              requests.
            </li>
            <li>To analyze usage trends and improve the App’s features.</li>
            <li>
              To comply with legal obligations and enforce our Terms of Service.
            </li>
          </ul>
          <h2 className="mt-4">3. Sharing Your Information</h2>
          <p>
            We do not share your personal information with third parties except
            in the following circumstances:
          </p>
          <ul>
            <li>
              Service Providers: We may share your information with trusted
              service providers who assist in delivering services to you (e.g.,
              analytics, cloud storage).
            </li>
            <li>
              Legal Obligations: We may disclose your information if required to
              do so by law or in response to valid legal requests by public
              authorities.
            </li>
            <li>
              Business Transfers: If we are involved in a merger, acquisition,
              or asset sale, your information may be transferred as part of that
              transaction.
            </li>
          </ul>
          <h2 className="mt-4">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            safeguard your information from unauthorized access, alteration,
            disclosure, or destruction. While we strive to protect your personal
            data, no method of transmission over the internet or electronic
            storage is completely secure. We cannot guarantee absolute security.
          </p>
          <h2 className="mt-4">5. Data Retention</h2>
          <p>
            We retain your personal information only for as long as is necessary
            for the purposes set out in this Privacy Policy, or as required by
            law. Once the data is no longer needed, we will delete or anonymize
            it.
          </p>
          <h2 className="mt-4">6. Children’s Privacy</h2>
          <p>
            The App is not intended for use by individuals under the age of 13.
            We do not knowingly collect personal information from children under
            13. If we become aware that we have collected such information, we
            will take steps to delete it as soon as possible.
          </p>
          <h2 className="mt-4">7. Your Rights and Choices</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>
              Access, correct, update, or request deletion of your personal
              information.
            </li>
            <li>Restrict or object to the processing of your information.</li>
            <li>Withdraw your consent at any time (if applicable).</li>
          </ul>
          <p>
            To exercise these rights, please contact us using the information
            provided in the “Contact Us” section below.
          </p>
          <h2 className="mt-4">8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted within the App, and the “Last Updated” date at the
            top will reflect the effective date of the updated policy. We
            encourage you to review this policy periodically for any changes.
          </p>
          <h2 className="mt-4">9. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us at:
          </p>
          <p>Email: info@vettee.vet</p>
          <p>
            By using the Vettee App, you acknowledge that you have read and
            understood this Privacy Policy and agree to its terms.
          </p>
        </article>
      </main>
    </div>
  );
}
