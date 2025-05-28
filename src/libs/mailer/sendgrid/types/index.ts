export type EmailPayload = {
  from?: {
    email: string;
    name: string;
  };

  personalizations: Personalizations[];
  template_id?: string;
  type?: string;
};

export type Personalizations = {
  to: {
    email: string;
    name: string;
  }[];
  dynamic_template_data?: DynamicTemplateData;
};

export type DynamicTemplateData = {
  hash?: string;
  subject?: string;
  [key: string]: any;
};
