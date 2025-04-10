package com.cocoa.backend.global.s3;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;
import software.amazon.awssdk.core.sync.RequestBody;

import java.io.IOException;
import java.net.URLConnection;
import java.util.Objects;
import java.util.UUID;

import com.cocoa.backend.global.config.S3Config;

import jakarta.annotation.PostConstruct;

@Service
@RequiredArgsConstructor
public class S3Service {
	private final S3Config s3Config;
	private S3Client s3Client;

    @PostConstruct
    public void init() {
        this.s3Client = s3Config.s3Client();
    }
	@Value("${aws.s3.name}")
	private String name;

	public String upload(MultipartFile file, String folder) {
		String ext = getExtension(Objects.requireNonNull(file.getOriginalFilename()));
		String fileName = folder + "/" + UUID.randomUUID() + ext;

		try {
			PutObjectRequest request = PutObjectRequest.builder()
				.bucket(name)
				.key(fileName)
				.contentType(URLConnection.guessContentTypeFromName(file.getOriginalFilename()))
				.build();

			PutObjectResponse response = s3Client.putObject(
				request,
				RequestBody.fromInputStream(file.getInputStream(), file.getSize())
			);
			return String.format("https://%s.s3.amazonaws.com/%s", name, fileName);
		} catch (IOException e) {
			throw new RuntimeException("S3 업로드 실패", e);
		}
	}

	private String getExtension(String fileName) {
		return fileName.substring(fileName.lastIndexOf("."));
	}
}