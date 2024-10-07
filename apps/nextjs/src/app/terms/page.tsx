import Link from "next/link";
import LogoText from "~/ui/logo-text";

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <LogoText />
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12">
         <div className="text-center text-3xl font-bold mb-4">
          Terms of Service
          </div>
          <div className="text-center text-gray-500 max-w-[600px] mx-auto">
            This covers the terms of use of the Vettee app. If you have any questions, please contact us at info@vettee.vet.
          </div>
          <div className="text-center text-gray-400 text-sm mt-8">Last updated: 7th October 2024</div>
        </section>
        <article className="prose lg:prose-xl max-w-3xl mx-auto pb-24">
          <p>
            Please read these Terms of Service ("Terms", "ToS") carefully before using the Vettee mobile application (the "Service") operated by [Your Company Name] ("us", "we", or "our").
          </p>
          <h2 className="mt-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
          </p>
          <h2 className="mt-4">2. Description of Service</h2>
          <p>
            Vettee is an AI-powered application designed to assist pet owners in caring for their pets. The app provides [brief description of key features, e.g., "personalized feeding schedules, exercise recommendations, and health monitoring"].
          </p>
          <h2 className="mt-4">3. User Accounts</h2>
          <h3>3.1. Account Creation</h3>
          <p>
            You must create an account to use certain features of the Service. You are responsible for maintaining the confidentiality of your account and password.
          </p>
          <h3>3.2. Accurate Information</h3>
          <p>
            You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <h2 className="mt-4">4. User Content</h2>
          <h3>4.1. Responsibility</h3>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("User Content"). You are responsible for the User Content that you post to the Service.
          </p>
          <h3>4.2. License</h3>
          <p>
            By posting User Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such User Content on and through the Service.
          </p>
          <h2 className="mt-4">5. AI-Generated Content and Recommendations</h2>
          <h3>5.1. Accuracy</h3>
          <p>
            The Service utilizes artificial intelligence to generate content and recommendations. While we strive for accuracy, we do not guarantee the completeness, reliability, or accuracy of this AI-generated content.
          </p>
          <h3>5.2. Professional Advice</h3>
          <p>
            AI-generated recommendations should not replace professional veterinary advice. Always consult with a qualified veterinarian for your pet's health concerns.
          </p>
          <h2 className="mt-4">6. Privacy Policy</h2>
          <p>
            Your use of the Service is also governed by our Privacy Policy, which can be found at [link to Privacy Policy].
          </p>
          <h2 className="mt-4">7. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of [Your Company Name] and its licensors.
          </p>
          <h2 className="mt-4">8. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <h2 className="mt-4">9. Limitation of Liability</h2>
          <p>
            In no event shall [Your Company Name], nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>
          <h2 className="mt-4">10. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page.
          </p>
          <h2 className="mt-4">11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at info@vettee.vet.
          </p>
          <p>
            By using the Service, you acknowledge that you have read and understood these Terms and agree to be bound by them.
          </p>
        </article>
      </main>
    </div>
  );
}
