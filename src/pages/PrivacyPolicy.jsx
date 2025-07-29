import React from 'react';
import SectionTitle from './Shared/Component/SectionTitle';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-base-100">
            {/* Banner Section */}
            <div className="relative bg-gradient-to-r from-primary/90 to-secondary/90 text-base-100 py-16 md:py-24">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                        We are committed to protecting your privacy and ensuring the security of your personal information.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <SectionTitle 
                        title="Privacy Policy" 
                        label="Legal"
                        labelPosition="center"
                        titlePosition="center"
                    />

                    <div className="space-y-8 text-secondary">
                        {/* Introduction */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">1. Introduction</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>
                                    At Petify, we respect your privacy and are committed to protecting your personal information. 
                                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                                    when you use our pet adoption and donation platform.
                                </p>
                                <p>
                                    By using our services, you consent to the data practices described in this policy. 
                                    If you do not agree with our policies and practices, please do not use our services.
                                </p>
                                <p>
                                    This policy applies to all users of our platform, including pet owners, adopters, 
                                    donors, and campaign creators.
                                </p>
                            </div>
                        </section>

                        {/* Information We Collect */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">2. Information We Collect</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p><strong>Personal Information:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Name, email address, and phone number</li>
                                    <li>Date of birth and age verification</li>
                                    <li>Address and location information</li>
                                    <li>Profile pictures and biographical information</li>
                                    <li>Payment information (processed securely by Stripe)</li>
                                </ul>
                                
                                <p><strong>Pet-Related Information:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Pet photos, descriptions, and health information</li>
                                    <li>Adoption history and preferences</li>
                                    <li>Pet care requirements and behavioral notes</li>
                                    <li>Veterinary records and vaccination status</li>
                                </ul>

                                <p><strong>Usage Information:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>IP address and device information</li>
                                    <li>Browser type and operating system</li>
                                    <li>Pages visited and time spent on our platform</li>
                                    <li>Search queries and preferences</li>
                                    <li>Communication with other users</li>
                                </ul>

                                <p><strong>Donation Information:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Donation amounts and frequency</li>
                                    <li>Campaign preferences and history</li>
                                    <li>Payment method preferences</li>
                                    <li>Receipt and tax information</li>
                                </ul>
                            </div>
                        </section>

                        {/* How We Use Your Information */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">3. How We Use Your Information</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>We use the information we collect for the following purposes:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li><strong>Service Provision:</strong> To provide and maintain our pet adoption and donation services</li>
                                    <li><strong>User Communication:</strong> To communicate with you about your account, pets, and donations</li>
                                    <li><strong>Matching:</strong> To connect pet owners with potential adopters</li>
                                    <li><strong>Payment Processing:</strong> To process donations and payments securely</li>
                                    <li><strong>Safety:</strong> To verify user identities and prevent fraud</li>
                                    <li><strong>Improvement:</strong> To improve our platform and user experience</li>
                                    <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                                    <li><strong>Support:</strong> To provide customer support and respond to inquiries</li>
                                </ul>
                            </div>
                        </section>

                        {/* Information Sharing */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">4. Information Sharing and Disclosure</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
                                
                                <p><strong>With Your Consent:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>When you explicitly authorize us to share your information</li>
                                    <li>When you choose to make your profile or pet information public</li>
                                </ul>

                                <p><strong>Service Providers:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Payment processors (Stripe) for secure payment processing</li>
                                    <li>Cloud hosting providers for data storage and security</li>
                                    <li>Email service providers for communication</li>
                                    <li>Analytics providers to improve our services</li>
                                </ul>

                                <p><strong>Legal Requirements:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>To comply with applicable laws and regulations</li>
                                    <li>To respond to legal requests and court orders</li>
                                    <li>To protect our rights, property, and safety</li>
                                    <li>To investigate potential violations of our terms</li>
                                </ul>

                                <p><strong>Business Transfers:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>In the event of a merger, acquisition, or sale of assets</li>
                                    <li>As part of a business reorganization</li>
                                </ul>
                            </div>
                        </section>

                        {/* Data Security */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">5. Data Security</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using industry-standard protocols</li>
                                    <li><strong>Access Controls:</strong> Strict access controls limit who can access your personal information</li>
                                    <li><strong>Regular Audits:</strong> We conduct regular security audits and assessments</li>
                                    <li><strong>Secure Infrastructure:</strong> Our platform is hosted on secure, reliable infrastructure</li>
                                    <li><strong>Payment Security:</strong> Payment information is processed securely through Stripe's PCI-compliant systems</li>
                                    <li><strong>Employee Training:</strong> Our team receives regular security training</li>
                                </ul>
                                <p>
                                    However, no method of transmission over the internet or electronic storage is 100% secure. 
                                    While we strive to protect your information, we cannot guarantee absolute security.
                                </p>
                            </div>
                        </section>

                        {/* Data Retention */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">6. Data Retention</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>We retain your personal information for as long as necessary to:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Provide our services to you</li>
                                    <li>Comply with legal obligations</li>
                                    <li>Resolve disputes and enforce agreements</li>
                                    <li>Maintain business records</li>
                                </ul>
                                <p><strong>Retention Periods:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li><strong>Account Information:</strong> Retained while your account is active and for 7 years after deactivation</li>
                                    <li><strong>Pet Information:</strong> Retained for 5 years after the last activity</li>
                                    <li><strong>Donation Records:</strong> Retained for 7 years for tax and legal purposes</li>
                                    <li><strong>Communication Data:</strong> Retained for 3 years after the last interaction</li>
                                    <li><strong>Log Data:</strong> Retained for 1 year for security and analytics purposes</li>
                                </ul>
                                <p>
                                    You may request deletion of your personal information, subject to legal and contractual obligations.
                                </p>
                            </div>
                        </section>

                        {/* Your Rights */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">7. Your Privacy Rights</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>You have the following rights regarding your personal information:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                                    <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                                    <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                                    <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                                    <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
                                    <li><strong>Objection:</strong> Object to processing of your personal information</li>
                                    <li><strong>Withdrawal:</strong> Withdraw consent for processing based on consent</li>
                                </ul>
                                <p>
                                    To exercise these rights, please contact us using the information provided below. 
                                    We will respond to your request within 30 days.
                                </p>
                            </div>
                        </section>

                        {/* Cookies and Tracking */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">8. Cookies and Tracking Technologies</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>We use cookies and similar tracking technologies to enhance your experience:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                                    <li><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform</li>
                                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                                    <li><strong>Security Cookies:</strong> Help protect against fraud and unauthorized access</li>
                                </ul>
                                <p>
                                    You can control cookie settings through your browser preferences. 
                                    However, disabling certain cookies may affect platform functionality.
                                </p>
                            </div>
                        </section>

                        {/* Third-Party Services */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">9. Third-Party Services</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>Our platform may contain links to third-party services. We are not responsible for the privacy practices of these services:</p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li><strong>Stripe:</strong> Payment processing (see Stripe's Privacy Policy)</li>
                                    <li><strong>Social Media:</strong> Login and sharing features</li>
                                    <li><strong>Analytics:</strong> Google Analytics and similar services</li>
                                    <li><strong>Communication:</strong> Email and messaging services</li>
                                </ul>
                                <p>
                                    We encourage you to review the privacy policies of any third-party services you use.
                                </p>
                            </div>
                        </section>

                        {/* Children's Privacy */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">10. Children's Privacy</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>
                                    Our services are not intended for children under 13 years of age. We do not knowingly collect 
                                    personal information from children under 13. If you are a parent or guardian and believe your 
                                    child has provided us with personal information, please contact us immediately.
                                </p>
                                <p>
                                    For users between 13 and 18 years old, we require parental consent for certain activities 
                                    and may collect limited information as necessary to provide our services.
                                </p>
                            </div>
                        </section>

                        {/* International Transfers */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">11. International Data Transfers</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>
                                    Your personal information may be transferred to and processed in countries other than your own. 
                                    We ensure that such transfers comply with applicable data protection laws and implement 
                                    appropriate safeguards to protect your information.
                                </p>
                                <p>
                                    For users in the European Union, we ensure adequate protection for international transfers 
                                    through standard contractual clauses and other approved mechanisms.
                                </p>
                            </div>
                        </section>

                        {/* Changes to Policy */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">12. Changes to This Privacy Policy</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>
                                    We may update this Privacy Policy from time to time. We will notify you of any material changes by:
                                </p>
                                <ul className="list-disc list-inside ml-4 space-y-2">
                                    <li>Posting the updated policy on our platform</li>
                                    <li>Sending you an email notification</li>
                                    <li>Displaying a prominent notice on our website</li>
                                </ul>
                                <p>
                                    Your continued use of our services after any changes indicates your acceptance of the updated policy.
                                </p>
                            </div>
                        </section>

                        {/* Contact Information */}
                        <section>
                            <h3 className="text-2xl font-bold text-primary mb-4">13. Contact Us</h3>
                            <div className="space-y-4 text-base leading-relaxed">
                                <p>
                                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                                </p>
                                <div className="bg-base-200 p-4 rounded-lg">
                                    <p><strong>Email:</strong> privacy@petify.com</p>
                                    <p><strong>Data Protection Officer:</strong> dpo@petify.com</p>
                                    <p><strong>Address:</strong> Petify Privacy Team</p>
                                    <p><strong>Response Time:</strong> We aim to respond to privacy inquiries within 48 hours</p>
                                </div>
                                <p>
                                    For users in the European Union, you also have the right to lodge a complaint with your 
                                    local data protection authority.
                                </p>
                            </div>
                        </section>

                        {/* Last Updated */}
                        <section className="border-t border-primary/20 pt-8">
                            <p className="text-sm text-secondary/60 text-center">
                                <strong>Last Updated:</strong> June 2025
                            </p>
                            <p className="text-sm text-secondary/60 text-center mt-2">
                                This Privacy Policy is effective as of the date listed above and will remain in effect 
                                except with respect to any changes in its provisions in the future.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;