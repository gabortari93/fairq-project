import {useEffect} from "react";
import TitleWithDescription from "../../components/TitleWithDescription.jsx";

export default function Privacy() {
    useEffect(() => {
        document.title = `Privacy Policy - fairQ`;
    });

    return (
        <div className="min-h-screen w-full px-4 pt-6 mb-20">
            <TitleWithDescription
                title="Privacy policy"
                description="At fairQ, we value your trust, and we're committed to protecting your personal information. Below, we explain how we collect, use, and safeguard your data."/>

            <div className="text-lg leading-relaxed text-gray-700">
                <h2 className="font-semibold mb-2">1. Data Protection Statement</h2>
                <p className="mb-4">
                    This Privacy Policy informs you about the nature, scope, and purpose of the collection and use of
                    personal data on our website fairQ (hereinafter "Website") by fairQ (hereinafter "we" or "us"). It
                    also informs you about your rights under the applicable data protection laws.
                </p>

                <h2 className="font-semibold mb-2">2. Data Controller</h2>
                <p className="mb-4">
                    The data controller for this website and contact for data protection concerns is:
                    <span className="ml-4 my-2 block">
                        fairQ<br/>
                        Alexander Müdespacher, Edit Guntermann, Sneha Chogule, and Gabor Tari<br/>
                        <a href="mailto:hello@fairq.app">hello@fairq.app</a>
                    </span>

                </p>

                <h2 className="font-semibold mb-2">3. Data Collection on this Website</h2>

                <h3 className="font-semibold mt-4 mb-2">3.1 Logfiles</h3>
                <p className="mb-4">
                    Our website is hosted by a company to be specified (address to be specified). We log technical
                    errors, if any, when accessing our website to optimize and maintain it. Furthermore, when using this
                    website, your device's browser automatically transmits information to our host provider. This
                    includes:
                    <ul className="ml-8 my-2 list-disc">
                        <li>IP address and operating system of your device,</li>
                        <li>Browser type, version, language,</li>
                        <li>Date and time of server request,</li>
                        <li>Accessed file,</li>
                        <li>The website from which the access was made (Referrer URL),</li>
                        <li>The status code (e.g., 404) and</li>
                        <li>The used transmission protocol (e.g., HTTP/2).</li>
                    </ul>
                    Our host provider collects and stores this data to optimize processes and procedures related to the
                    use of our website and to ensure the security and stability of the computer system. For more
                    information, please refer to the privacy policy of the hosting company at <a
                    href="https://www.digitalocean.com/legal/privacy-policy" target="_blank">DigitalOcean</a>.
                    If GDPR is applicable, the legal basis for this data processing is Art. 6 para. 1 lit. f GDPR.
                </p>

                <h3 className="font-semibold mt-4 mb-2">3.2 Contact Form</h3>
                <p className="mb-4">
                    If you use our contact form or send an email to us, your details from the enquiry form will be
                    processed by us to process
                    the request and in case of follow-up questions. We usually need the following details: Full name,
                    Company, E-mail address, Address, Telephone number, Subject, Message content.
                </p>

                <h3 className="font-semibold mt-4 mb-2">3.3 Cookies</h3>
                <p className="mb-4">
                    We use cookies on our website. Cookies are small files that are stored on your device by your
                    browser. Some of the cookies we use are automatically deleted when you leave our website. Other
                    cookies remain stored on your device until you delete them or they expire. These cookies enable us
                    to recognize your browser on your next visit to our website.
                    You can set your browser to inform you about the setting of cookies in advance and decide on a
                    case-by-case basis whether to accept cookies in specific cases or in general, or to completely
                    prevent cookies. However, this may restrict the functionality of the website.
                    Cookies that are necessary for the electronic communication process or to provide functions you wish
                    to use or optimize your user experience, if the GDPR is applicable, are stored based on Art. 6 para.
                    1 lit. f GDPR.
                </p>
                <h3 className="font-semibold mt-4 mb-2">3.4 Newsletter</h3>

                <p className="mb-4">
                    We offer a newsletter that you can subscribe to. When you sign up for the newsletter, we collect at
                    least your email address. Our external newsletter service provider may collect additional data; we
                    refer to their privacy policy (see below).
                    We use your email address to send you the newsletter by email. If the GDPR is applicable, the legal
                    basis for data processing is Art. 6 para. 1 lit. f GDPR.
                </p>
                <p className="mb-4">
                    We use an analytics service to measure the reach of our newsletter. It measures how often the
                    newsletter is opened and which links the recipient follows.
                    If the GDPR is applicable, the legal basis for data processing is Art. 6 para. 1 lit. f GDPR.
                </p>

                <h3 className="font-semibold mt-4 mb-2">3.6 Registration</h3>

                <h4 className="font-semibold mt-3 mb-1">3.6.1 As an Editor</h4>
                <p className="mb-4">
                    When you register on our website as an Editor, the individual who creates and manages waiting lists,
                    the following details are collected: email, first name, and last name. We save this data to provide
                    you with an account. If the GDPR is applicable, the legal basis for this data processing is Art. 6
                    para. 1 lit. b and f GDPR.
                </p>

                <h4 className="font-semibold mt-3 mb-1">3.6.2 As an Applicant</h4>
                <p className="mb-4">
                    When you register on our website as an Applicant, intending to join a waiting list, we collect all
                    the data you provide. The specific data requested may vary depending on the waiting list that you
                    join, as determined by the Editors' configuration. At a minimum, we always collect your first name,
                    last name, and email. By registering, you acknowledge that all designated members of the
                    organization managing the waiting list may have access to the provided data.
                </p>

                <h2 className="font-semibold mb-2">4. External Services</h2>

                <p className="mb-4">
                    We use various third-party services on our website. We specify which services they are, what we use
                    them for, and what data is collected.
                    The integration of external services can be critical according to current European case law. The
                    transfer of personal data to external providers (example: Analytics, advertising, CDN, fonts,
                    videos, etc.) should be analyzed on a case-by-case basis.
                </p>

                <h3 className="font-semibold mt-4 mb-2">4.1 SendGrid</h3>
                <p className="mb-4">
                    We use SendGrid, a product from Twilio Inc. located at 375 Beale Street, Suite 300, San Francisco,
                    CA 94105, USA. SendGrid is a cloud-based email delivery service that assists businesses in sending
                    email notifications, promotions, and newsletters to their customers. If the GDPR is applicable, the
                    legal basis for data processing is Art. 6 para. 1 lit. a GDPR, Art. 6 para. 1 lit. b GDPR, or Art. 6
                    para. 1 lit. f GDPR.
                </p>
                <p className="mb-4">
                    You can find the privacy policy of Twilio Inc., which includes SendGrid, at <a
                    href="https://www.twilio.com/legal/privacy"
                    className="text-blue-500 hover:text-blue-700">https://www.twilio.com/legal/privacy</a>.
                </p>

                <h2 className="font-bold mt-10 mb-4">5. Links</h2>
                <p className="mb-4">
                    You will find links to third-party websites on our website. We are not responsible for the content
                    and data protection precautions on external websites that you can access via the links. Please
                    inform yourself about data protection directly on the respective websites.
                </p>

                <h2 className="font-bold mt-10 mb-4">6. Disclosure of Data to Third Parties</h2>
                <p className="mb-4">
                    To provide the information on our website, we work with various service providers, namely with IT
                    service providers, to offer you a contemporary website. These use your data only within the scope of
                    order processing for us.
                    Except for the provisions in point 3.4 of this Privacy Policy, we only transmit data to places
                    outside of Switzerland and the European Union (third countries) without your consent if this is
                    necessary according to the respective contract, to fulfill legal obligations or to safeguard our
                    legitimate interests.
                </p>

                <h2 className="font-bold mt-10 mb-4">7. Your Rights</h2>
                <p className="mb-4">
                    As provided by the applicable data protection law, you can request free information about the stored
                    data related to you, its origin and recipients, and the purpose of data processing. You also have
                    the right to correction, deletion, restriction of or objection to processing under legal conditions,
                    and if the GDPR applies, to have this data handed over to another place.
                    You can revoke any consent given with effect for the future at any time. A simple email to us is
                    sufficient for this.
                    Please note that the above rights are subject to legal restrictions and may affect or prevent the
                    provision of our services.
                    You are entitled to enforce your claims in court or file a complaint with the responsible data
                    protection authority.
                </p>

                <h2 className="font-bold mt-10 mb-4">8. Updating and Changing this Privacy Policy</h2>
                <p className="mb-4">
                    We may change or adapt this privacy policy at any time. The current privacy policy can be accessed
                    at fairQ.
                </p>


            </div>
        </div>
    );
}
