import { Test } from '@nestjs/testing';
import { FileUploaderPort } from '../uploader/ports/file-uploader.port';
import { CreatePresignedUrlService } from './create-presigned-url.service';
import { FILE_UPLOADER } from '../file.di-tokens';
import { PresignedRequest } from '../domain/value-objects/presigned-request.value-object';
import { CreatePresignedUrlCommand } from './create-presigned-url.command';

describe('CreatePresignedUrlService', () => {
  let service: CreatePresignedUrlService;
  let uploader: jest.Mocked<FileUploaderPort>;

  beforeEach(async () => {
    const mockUploader: jest.Mocked<FileUploaderPort> = {
      generatePresignedUrl: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CreatePresignedUrlService,
        {
          provide: FILE_UPLOADER,
          useValue: mockUploader,
        },
      ],
    }).compile();

    service = moduleRef.get(CreatePresignedUrlService);
    uploader = moduleRef.get(FILE_UPLOADER);
  });

  it('should return a presigned URL from uploader', async () => {
    const request = new PresignedRequest({
      mimetype: 'image/jpeg',
      uploaderId: 'user-123',
      filename: 'example.jpg',
    });

    const command = new CreatePresignedUrlCommand({
      presigendRequest: request,
    });

    const mockResult = {
      key: 'uploads/user-123/123456-example.jpg',
      url: 'https://s3.fake.amazonaws.com/upload/abc123',
    };

    uploader.generatePresignedUrl.mockResolvedValue(mockResult);

    const result = await service.execute(command);

    expect(result).toEqual(mockResult);
    expect(uploader.generatePresignedUrl).toHaveBeenCalledWith(request);
  });
});
