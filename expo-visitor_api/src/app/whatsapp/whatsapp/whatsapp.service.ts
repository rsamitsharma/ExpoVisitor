import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class WhatsappService {
    private readonly logger = new Logger(WhatsappService.name);

    async sendWhatsAppMsgDynamic(data: {
        apiKey: string;
        to: string;
        templateName: string;
        languageCode?: string;
        headerType?: string;
        bodyParams?: { type?: string; text: string }[];
        buttonParams?: { type: string; text: string }[];
    }) {
        try {
            const {
                apiKey,
                to,
                templateName,
                languageCode = 'en',
                headerType = '',
                bodyParams,
                buttonParams,
            } = data;

            const url = 'https://app.jalpi.com/api/v1/sendTemplateMessage';

            // Base payload
            const payload: any = {
                key: apiKey,
                to,
                TemplateName: templateName,
                languageCode,
                headertype: headerType,
            };

            // ✅ Add BodyParameter ONLY if provided
            if (Array.isArray(bodyParams) && bodyParams.length > 0) {
                payload.BodyParameter = bodyParams.map((param) => ({
                    type: param.type || 'text',
                    text: param.text,
                }));
            }

            // ✅ Add ButtonParameter ONLY if provided
            if (Array.isArray(buttonParams) && buttonParams.length > 0) {
                payload.ButtonParameter = buttonParams.map((btn) => ({
                    type: btn.type, // call_to_action / url / phone
                    text: btn.text,
                }));
            }

            this.logger.log(`Sending WhatsApp payload: ${JSON.stringify(payload)}`);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const json = await response.json();

            this.logger.log(`WhatsApp API response: ${JSON.stringify(json)}`);

            return {
                success: true,
                requestPayload: payload,
                response: json,
            };
        } catch (error) {
            this.logger.error(`WhatsApp API Error: ${error.message}`);
            throw new Error(error.message);
        }
    }
}
