package com.myfave.api.global.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    public String getBucket() {
        return bucket;
    }
}
