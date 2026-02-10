import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailLogTable } from '../database/tables/maillog.table';
import { SendVisitorConfirmationDto, MailLogQueryDto } from '../models/dto/mail.dto';
import { DB_CONFIG } from '../environment/environment';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private transporter: nodemailer.Transporter;
    private isConfigured: boolean = false;

    constructor() {
        this.initializeTransporter();
    }

    private async initializeTransporter(): Promise<void> {
        // Check if real SMTP credentials are configured
        if (DB_CONFIG.EMAIL_USER && DB_CONFIG.EMAIL_PASSWORD) {
            this.transporter = nodemailer.createTransport({
                host: DB_CONFIG.EMAIL_HOST || 'smtp.office365.com',
                port: DB_CONFIG.EMAIL_PORT || 587,
                secure: false,
                auth: {
                    user: DB_CONFIG.EMAIL_USER,
                    pass: DB_CONFIG.EMAIL_PASSWORD,
                },
            });
            this.isConfigured = true;
            this.logger.log('Mail service configured with SMTP credentials');
        } else {
            // Use Ethereal for development/testing
            try {
                const testAccount = await nodemailer.createTestAccount();
                this.transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });
                this.isConfigured = true;
                this.logger.log('Mail service configured with Ethereal (test mode)');
                this.logger.log(`Ethereal credentials: ${testAccount.user}`);
            } catch (error) {
                this.logger.error('Failed to create Ethereal test account:', error.message);
            }
        }
    }

    private generateConfirmationEmailHtml(visitorName: string, expoName?: string): string {
        return `
       <!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
        .highlight { color: #667eea; font-weight: bold; }
        .list-item { margin-bottom: 8px; }
        a { color: #667eea; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Greetings from Responscity!</h1>
        </div>
        <div class="content">
            <p>Dear <span class="highlight">${visitorName}</span>,</p>

            <p>Thank you for taking the time to visit our stall at the <strong>Municipalika Expo 2026</strong> at Bharat Mandapam, New Delhi. It was a pleasure interacting with you and understanding your vision for smarter urban governance.</p>

            <p>We truly appreciate your interest in our technology-driven solutions. At Responscity, we are committed to empowering local bodies with tools that ensure efficiency, safety, and transparency.</p>
            
            <p>As discussed, our core expertise includes:</p>
            <ul style="list-style-type: none; padding-left: 0;">
                <li class="list-item">🌊 Disaster Management & Early Warning Systems</li>
                <li class="list-item">🏛️ Digital Governance & Municipal ERP</li>
                <li class="list-item">🏙️ Smart Urban Management Solutions</li>
            </ul>

            <p>We would be delighted to continue our conversation. Whether you need a detailed demonstration, a specific case study, or a technical discussion, our team is ready to assist.</p>

            <p>👉 <strong>Explore our solutions here:</strong> <a href="https://responscity.co.in/">https://responscity.com/</a></p>

            <p><span class="highlight">Next Steps:</span><br>
            If you would like to schedule a quick follow-up meeting or receive a tailored presentation, please reply to this email, and we will set it up at your convenience.</p>

            <p>Thank you once again for stopping by. We look forward to the opportunity to collaborate and build smarter cities together.</p>

            <br>
            <p>Warm regards,<br>
            <strong>Team Responscity Systems Pvt. Ltd.</strong><br>
            🌐 <a href="https://responscity.co.in">www.responscity.com</a><br>
            📧 <a href="mailto:info@responscity.com">info@responscity.com</a><br>
            📞 +91 77679 87464</p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    async sendVisitorConfirmation(data: SendVisitorConfirmationDto): Promise<MailLogTable> {
        const subject = `Registration Confirmed${data.ExpoName ? ` - ${data.ExpoName}` : ''}`;
        const htmlBody = this.generateConfirmationEmailHtml(data.VisitorName, data.ExpoName);

        // Create log entry first
        const mailLog = await MailLogTable.create({
            VisitorID: data.VisitorID,
            ExpoID: data.ExpoID,
            RecipientEmail: data.RecipientEmail,
            Subject: subject,
            Body: htmlBody,
            Status: 'Pending',
        } as any);
        this.logger.log(`Created mail log keys: ${Object.keys(mailLog?.dataValues || mailLog)}`);

        // Handle case where RID might be returned as lowercase 'rid'
        const mailLogId = mailLog.toJSON().RID || (mailLog as any).rid;

        if (!mailLogId) {
            this.logger.error('MailLog created but RID/rid is missing! Cannot proceed with update.');
            // If we can't get the ID, we can't update.
            // But we can still try sending the email since log entry exists (even if we lost handle to it partially)
        }

        try {
            if (!this.isConfigured) {
                await this.initializeTransporter();
            }

            const info = await this.transporter.sendMail({
                from: DB_CONFIG.EMAIL_USER || '"ExpoVisitor" <noreply@expovisitor.com>',
                to: data.RecipientEmail,
                subject: subject,
                html: htmlBody,
            });

            // Update log with success
            if (mailLogId) {
                await MailLogTable.update(
                    {
                        Status: 'Sent',
                        SentDate: new Date(),
                    } as any,
                    { where: { RID: mailLogId } as any }
                );
            }

            // Log preview URL for Ethereal
            if (info.messageId) {
                this.logger.log(`Email sent, Message ID: ${info.messageId}`);
                const previewUrl = nodemailer.getTestMessageUrl(info);
                if (previewUrl) {
                    this.logger.log(`Preview URL: ${previewUrl}`);
                }
            }

            if (mailLogId) {
                await mailLog.reload();
            }
            return mailLog;
        } catch (error) {
            // Update log with failure
            if (mailLogId) {
                await MailLogTable.update(
                    {
                        Status: 'Failed',
                        ErrorMessage: error.message || 'Unknown error',
                    } as any,
                    { where: { RID: mailLogId } as any }
                );

                await mailLog.reload();
            }
            this.logger.error(`Failed to send email: ${error.message}`);
            return mailLog;
        }
    }

    async getLogs(query?: MailLogQueryDto): Promise<MailLogTable[]> {
        const whereClause: any = {};

        if (query?.status) {
            whereClause.Status = query.status;
        }
        if (query?.expoId) {
            whereClause.ExpoID = query.expoId;
        }

        return await MailLogTable.findAll({
            where: whereClause,
            order: [['CreatedDate', 'DESC']],
            limit: query?.limit || 100,
        });
    }

    async getLogById(id: number): Promise<MailLogTable | null> {
        return await MailLogTable.findByPk(id);
    }

    async getLogsByVisitor(visitorId: number): Promise<MailLogTable[]> {
        return await MailLogTable.findAll({
            where: { VisitorID: visitorId } as any,
            order: [['CreatedDate', 'DESC']],
        });
    }
}
