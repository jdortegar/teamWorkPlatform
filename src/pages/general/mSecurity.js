import React from 'react';
import { Link } from 'react-router';

const mSecurity = () => {
	return (
		<section>
			<div className="header">
				<h1>Security Practices</h1>
			</div>
			<div className="security">
				<div className="center">
					Effective: April 14, 2017 
				</div>


 <br />
<p>We take the security of your data very seriously at Habla AI. As transparency is one of the principles on which our company is built, we aim to be as clear and open as we can about the way we handle security.
</p>
<p>
If you have additional questions regarding security, we are happy to answer them. Please write to <Link to="/#" className="blue-link">feedback@habla.ai</Link>  and we will respond as quickly as we can.
</p>

<h4>Confidentiality</h4>
<p>We place strict controls over our employees’ access to the data you and your users make 
available via the Habla AI services, as more specifically defined in your agreement with 
Habla AI covering the use of the Habla AI services (<b>"Customer Data"</b>), and are committed to ensuring that Customer Data is not seen by anyone who should not have access to it. The operation of the Habla AI services requires that some employees have access to the systems which store and process Customer Data. For example, in order to diagnose a problem you are having with the Habla AI services, we may need to access your Customer Data. These employees are prohibited from using these permissions to view Customer Data unless it is necessary to do so. We have technical controls and audit policies in place to ensure that any access to Customer Data is logged.
</p>
<p>All of our employees and contract personnel are bound to our policies regarding Customer Data and we treat these issues as matters of the highest importance within our company.
</p>
<h4>Personnel Practices</h4>
<p>Habla AI conducts background checks on all employees before employment, and employees receive security training during onboarding and on an ongoing basis. All employees are required to read and sign our comprehensive information security policy covering the security, availability, and confidentiality of the Habla AI services.
</p>
<h4>Compliance</h4>
<p>The following security-related audits and certifications are applicable to the Habla AI services:
</p>
<ul className="security-list">
	<li><b>Service Organization Control (SOC) Reports</b>: Habla AI has undergone a SOC 2 audit, and a copy of Habla AI’s most recent report is available upon request from your Account Manager.
	</li>
	<li><b>PCI:</b> Habla AI is not currently a PCI-certified Service Provider. We are a PCI Level 4 Merchant and have completed the Payment Card Industry Data Security Standard’s SAQ-A, allowing us to use a third party to process your credit card information securely.
	</li>
</ul>
<p>The environment that hosts the Habla AI services maintains multiple certifications for 
its data centers, including ISO 27001 compliance, PCI Certification, and SOC reports. 
For more information about their certification and compliance, please visit the <a href="https://aws.amazon.com/security" className="blue-link"> AWS Security </a>
website and the <a href="https://aws.amazon.com/compliance" className="blue-link">AWS Compliance</a> website.
</p>
<h4>Security Features for Team Members & Administrators</h4>
<p>In addition to the work we do at the infrastructure level, we provide Team Administrators of paid versions of the Habla AI services with additional tools to enable their own users to protect their Customer Data.</p>
<h4>Access Logging</h4>
<p>Detailed access logs are available both to users and administrators of Small Business, Mid-sized Business, and Enterprise paid teams. We log every time an account signs in, noting the type of device used and the IP address of the connection.
</p>
<p>Team Administrators and owners of paid teams can review consolidated access logs for their whole team. We also make it easy for administrators to remotely terminate all connections and sign out all devices authenticated to the Habla AI services at any time, on-demand.
</p>
<h4>Team-Wide Two-Factor Authentication</h4>
<p>Team Administrators can require all users to set up two-factor authentication on their accounts. Instructions for doing this are available on our Help Center.
</p>
<h4>Single Sign On</h4>
<p>Administrators of paid teams can integrate their Habla AI services instance with a variety of single-sign-on providers. Teams on the ‘Small Business’ plan can enable Google Apps for Domains as their authentication provider, and teams on the Mid-sized and Enterprise plans can enable SAML SSO with providers such as OneLogin, Okta, Centrify, and Ping Identity.
</p>
<h4>Data Retention</h4>
<p>Owners of paid Habla AI teams can configure <Link to="/#" className="blue-link">custom message retention policies</Link> on a team-wide and per-channel basis. Setting a custom duration for retention means that messages or files older than the duration you set will be deleted on a nightly basis.
</p>
<h4>Deletion of Customer Data</h4>
<p>Habla AI provides the option for Team Owners to delete Customer Data at any time during a subscription term. Within 24 hours of Team Owner initiated deletion, Habla AI hard deletes all information from currently-running production systems (excluding Teams and Team Rooms names, and search terms embedded in URLs in web server access logs). Habla AI services backups are destroyed within 30 days.
</p>
<h4>Return of Customer Data</h4>
<p>The Habla AI services include the following export capabilities:</p>
<ul className="security-list">

	<li><b>Standard Exports</b>: During a subscription term administrators of any Habla AI services plan can export Customer Data from team channels, but not from direct messages or private channels.
	</li>
	<li><b>Compliance Exports</b>: In addition to ‘Standard Exports’, to the extent the ‘Compliance Exports’ feature is enabled by an administrator of a ‘Plus’ plan, such administrator can also export Customer Data from direct messages and private channels during a subscription term. These exports can be initiated at any time during a subscription term, or at regular scheduled intervals during a subscription term for archival purposes.
	</li>
</ul>
<p>More information about the export capabilities of the Habla AI services can be found at our Help Center.
</p>
<h4>Data Encryption In Transit and At Rest</h4>
<p>The Habla AI services support the latest recommended secure cipher suites and protocols to encrypt all traffic in transit. Customer Data is encrypted at rest.
</p>
<p>We monitor the changing cryptographic landscape closely and work promptly to upgrade the service to respond to new cryptographic weaknesses as they are discovered and implement best practices as they evolve. For encryption in transit, we do this while also balancing the need for compatibility for older clients.
</p>
<h4>Availability</h4>
<p>We understand that you rely on the Habla AI services to work. We&#39;re committed to making Habla AI a highly-available service that you can count on. Our infrastructure runs on systems that are fault tolerant, for failures of individual servers or even entire data centers. Our operations team tests disaster-recovery measures regularly and staffs an around-the-clock on-call team to quickly resolve unexpected incidents.
</p>
<h4>Disaster Recovery</h4>
<p>Customer Data is stored redundantly at multiple locations in our hosting provider’s data centers to ensure availability. We have well-tested backup and restoration procedures, which allow recovery from a major disaster. Customer Data and our source code are automatically backed up nightly. The Operations team is alerted in case of a failure with this system. Backups are fully tested at least every 90 days to confirm that our processes and tools work as expected.
</p>
<h4>Network Protection</h4>
<p>In addition to sophisticated system monitoring and logging, we have implemented two-factor authentication for all server access across our production environment. Firewalls are configured according to industry best practices and unnecessary ports are blocked by configuration with AWS Security Groups.
</p>
<h4>Host Management</h4>
<p>We perform automated vulnerability scans on our production hosts and remediate any findings that present a risk to our environment. We enforce screens lockouts and the usage of full disk encryption for company laptops.
</p>
<h4>Logging</h4>
<p>Habla AI maintains an extensive, centralized logging environment in its production environment which contains information pertaining to security, monitoring, availability, access, and other metrics about the Habla AI services. These logs are analyzed for security events via automated monitoring software, overseen by the security team.
</p>
<h4>Incident Management & Response</h4>
<p>In the event of a security breach, Habla AI will promptly notify you of any unauthorized access to your Customer Data. Habla AI has incident management policies and procedures in place to handle such an event.
</p>
<h4>External Security Audits</h4>
<p>We contract with respected external security firms who perform regular audits of the Habla AI services to verify that our security practices are sound and to monitor the Habla AI services for new vulnerabilities discovered by the security research community. In addition to periodic and targeted audits of the Habla AI services and features, we also employ the use of continuous hybrid automated scanning of our web platform.
</p>
<h4>Product Security Practices</h4>

<p>New features, functionality, and design changes go through a security review process facilitated by the security team. In addition, our code is audited with automated static analysis software, tested, and manually peer-reviewed prior to being deployed to production. The security team works closely with development teams to resolve any additional security concerns that may arise during development.
</p>
<p>Habla AI also operates a security bug bounty program. Security researchers around the world continuously test the security of the Habla AI services, and report issues via the program. More details of this program are available at <Link to="/#" className="blue-link">the bounty site</Link>.
</p>






			</div>
			</section>
	);
}

export default mSecurity;