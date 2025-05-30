import { DynamicTemplateData, EmailPayload } from '../types';

export class EmailBuilder {
  private data: EmailPayload = {
    personalizations: [],
  };

  addPersonalization(
    toName: string,
    toEmail: string,
    dynamicTemplate?: DynamicTemplateData,
  ) {
    this.data.personalizations.push({
      to: [{ email: toEmail, name: toName }],
      dynamic_template_data: dynamicTemplate,
    });
    return this;
  }

  setType(type: string) {
    this.data.type = type;
    return this;
  }

  setFrom(email: string, name: string) {
    this.data.from = { email, name };
    return this;
  }

  setTemplateId(id: string) {
    this.data.template_id = id;
    return this;
  }

  build(): EmailPayload {
    return this.data;
  }
}
