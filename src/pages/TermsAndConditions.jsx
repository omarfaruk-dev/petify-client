import React from 'react';
import SectionTitle from './Shared/Component/SectionTitle';

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-base-100">
            {/* Banner Section */}
            <div className="relative bg-gradient-to-r from-primary/90 to-secondary/90 text-base-100 py-16 md:py-24">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Terms & Conditions</h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                        Please read these terms and conditions carefully before using our pet adoption and donation platform.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <SectionTitle 
                        title="Terms and Conditions" 
                        label="Legal"
                        labelPosition="center"
                        titlePosition="center"
                    />

                    <div className="space-y-8 text-secondary">
                        {/* General Terms */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">1. General Terms</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>
                                    By accessing and using Petify, you accept and agree to be bound by the terms and provision of this agreement. 
                                    If you do not agree to abide by the above, please do not use this service.
                                </p>
                                <p>
                                    Petify reserves the right to modify these terms at any time. We will notify users of any material changes 
                                    via email or through a notice on our website.
                                </p>
                                <p>
                                    You must be at least 18 years old to use our services. If you are under 18, you may only use our services 
                                    with the involvement of a parent or guardian.
                                </p>
                            </div>
                        </section>

                        {/* User Accounts */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">2. User Accounts</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>
                                    You are responsible for maintaining the confidentiality of your account information and password. 
                                    You agree to accept responsibility for all activities that occur under your account.
                                </p>
                                <p>
                                    You must provide accurate, current, and complete information during registration and keep your 
                                    account information updated.
                                </p>
                                <p>
                                    We reserve the right to terminate accounts, remove or edit content, or cancel orders at our sole discretion.
                                </p>
                            </div>
                        </section>

                        {/* Pet Adoption Terms */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">3. Pet Adoption</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>
                                    Petify serves as a platform connecting potential adopters with pet owners and rescue organizations. 
                                    We do not own, sell, or guarantee the health or behavior of any pets listed on our platform.
                                </p>
                                <p>
                                    All adoption requests are subject to approval by the pet owner or rescue organization. 
                                    Petify is not responsible for the outcome of adoption requests.
                                </p>
                                <p>
                                    Adopters are responsible for:
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Conducting their own research about the pet and breed</li>
                                    <li>Ensuring they can provide proper care and attention</li>
                                    <li>Complying with local laws and regulations regarding pet ownership</li>
                                    <li>Arranging transportation and meeting with the pet owner</li>
                                </ul>
                                <p>
                                    Pet owners are responsible for:
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Providing accurate information about their pets</li>
                                    <li>Ensuring pets are healthy and up-to-date on vaccinations</li>
                                    <li>Being honest about any behavioral or health issues</li>
                                    <li>Responsibly screening potential adopters</li>
                                </ul>
                            </div>
                        </section>

                        {/* Donation Campaigns */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">4. Donation Campaigns</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>
                                    Petify allows users to create and participate in donation campaigns for animal welfare causes. 
                                    Campaign creators must provide accurate information about their cause and intended use of funds.
                                </p>
                                <p>
                                    All donations are processed through secure payment gateways. Petify takes a small percentage 
                                    of each donation to cover platform maintenance and operational costs.
                                </p>
                                <p>
                                    Campaign creators are responsible for:
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Using donated funds for the stated purpose</li>
                                    <li>Providing updates on campaign progress</li>
                                    <li>Maintaining transparency about fund usage</li>
                                    <li>Complying with local fundraising regulations</li>
                                </ul>
                            </div>
                        </section>

                        {/* Payment Terms - Stripe */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">5. Payment Terms & Stripe Integration</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>
                                    All payments on Petify are processed securely through Stripe, a third-party payment processor. 
                                    By making a payment, you agree to Stripe's terms of service and privacy policy.
                                </p>
                                <p>
                                    <strong>Payment Processing:</strong>
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>All donations are processed in real-time through Stripe's secure payment gateway</li>
                                    <li>We accept major credit cards, debit cards, and digital wallets supported by Stripe</li>
                                    <li>Payment information is encrypted and never stored on our servers</li>
                                    <li>Stripe handles all PCI compliance and security standards</li>
                                </ul>
                                <p>
                                    <strong>Refund Policy:</strong>
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Donations are generally non-refundable unless there is a technical error</li>
                                    <li>Refund requests must be submitted within 30 days of the donation</li>
                                    <li>Refunds are processed through the original payment method</li>
                                    <li>Processing fees are non-refundable</li>
                                </ul>
                                <p>
                                    <strong>Processing Fees:</strong>
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Stripe charges a processing fee of approximately 2.9% + $0.30 per transaction</li>
                                    <li>Petify may charge additional platform fees as disclosed during checkout</li>
                                    <li>All fees are clearly displayed before payment confirmation</li>
                                </ul>
                                <p>
                                    <strong>Security:</strong>
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>All payment data is encrypted using industry-standard SSL/TLS protocols</li>
                                    <li>Stripe is PCI DSS Level 1 compliant</li>
                                    <li>We never store your complete payment information on our servers</li>
                                    <li>All transactions are monitored for fraud and security</li>
                                </ul>
                            </div>
                        </section>

                        {/* Privacy and Data */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">6. Privacy and Data Protection</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>
                                    We are committed to protecting your privacy. Our collection and use of personal information 
                                    is governed by our Privacy Policy, which is incorporated into these terms by reference.
                                </p>
                                <p>
                                    We may collect and process personal data including but not limited to:
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Name, email address, and contact information</li>
                                    <li>Payment information (processed securely by Stripe)</li>
                                    <li>Pet information and adoption history</li>
                                    <li>Usage data and analytics</li>
                                </ul>
                                <p>
                                    We will not sell, trade, or otherwise transfer your personal information to third parties 
                                    without your consent, except as required by law or as necessary to provide our services.
                                </p>
                            </div>
                        </section>

                        {/* Prohibited Activities */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">7. Prohibited Activities</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>You agree not to:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Use our services for any illegal or unauthorized purpose</li>
                                    <li>Violate any applicable laws or regulations</li>
                                    <li>Infringe upon the rights of others</li>
                                    <li>Upload or transmit malicious code or harmful content</li>
                                    <li>Attempt to gain unauthorized access to our systems</li>
                                    <li>Impersonate another person or entity</li>
                                    <li>Use our platform for commercial purposes without permission</li>
                                    <li>Harass, abuse, or harm other users</li>
                                </ul>
                            </div>
                        </section>

                        {/* Limitation of Liability */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">8. Limitation of Liability</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>
                                    Petify is provided "as is" without warranties of any kind. We are not liable for any 
                                    damages arising from the use of our services, including but not limited to:
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Direct, indirect, incidental, or consequential damages</li>
                                    <li>Loss of profits, data, or business opportunities</li>
                                    <li>Damages resulting from pet adoption or donation activities</li>
                                    <li>Technical issues or service interruptions</li>
                                </ul>
                                <p>
                                    Our total liability shall not exceed the amount paid by you for our services in the 
                                    twelve months preceding the claim.
                                </p>
                            </div>
                        </section>

                        {/* Contact Information */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">9. Contact Information</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>
                                    If you have any questions about these Terms and Conditions, please contact us:
                                </p>
                                <div className="bg-base-200 p-4 rounded-lg">
                                    <p><strong>Email:</strong> support@petify.com</p>
                                    <p><strong>Address:</strong> Petify Support Team</p>
                                    <p><strong>Response Time:</strong> We aim to respond to all inquiries within 24-48 hours</p>
                                </div>
                            </div>
                        </section>

                        {/* Last Updated */}
                        <section className="border-t border-primary/20 pt-8">
                            <p className="text-sm text-secondary/60 text-center">
                                <strong>Last Updated:</strong> December 2024
                            </p>
                            <p className="text-sm text-secondary/60 text-center mt-2">
                                These terms and conditions are effective as of the date listed above and will remain in effect 
                                except with respect to any changes in their provisions in the future.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;