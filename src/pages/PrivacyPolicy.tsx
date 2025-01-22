export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-2xl p-8 shadow-xl space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-gray-600">
              At InfiniteConvert, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Process</h2>
            <p className="text-gray-600 mb-4">
              Our service processes your images directly in your browser. This means:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Your files never leave your device</li>
              <li>We don't store any of your images on our servers</li>
              <li>All processing happens locally in your web browser</li>
              <li>We don't track individual file conversions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
            <p className="text-gray-600 mb-4">
              We collect minimal anonymous usage data to improve our service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Screen resolution</li>
              <li>Anonymous usage statistics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="text-gray-600">
              We use essential cookies to ensure the basic functionality of our website. These cookies don't collect any personal information and are strictly necessary for the website to function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-gray-600">
              We don't share any information with third parties. Our service is completely self-contained and processes everything locally in your browser.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Security</h2>
            <p className="text-gray-600">
              We take security seriously. Since all processing happens in your browser:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Your files are never uploaded to our servers</li>
              <li>We use HTTPS encryption for all communications</li>
              <li>We regularly update our security measures</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about this Privacy Policy, please contact us at privacy@infiniteconvert.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}