export interface PresignedUrlResult {
  url: string;
  key: string;
}

export interface PresignedRequestProps {
  filename: string;
  mimetype: string;
  uploaderId: string;
}
